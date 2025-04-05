import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useEffect, type ReactElement } from 'react';

interface OddsHistoryPoint {
  timestamp: string;
  yesOdds: string;
  noOdds: string;
}

export function OddsChart({ marketId }: { marketId: number }) {
  const { data: history = [], refetch } = useQuery({
    queryKey: ['oddsHistory', marketId],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${marketId}/odds-history`);
      return response.json();
    }
  });

  // Expose refetch function to parent
  useEffect(() => {
    // @ts-ignore
    window.refetchOddsHistory = refetch;
  }, [refetch]);

  // Get the latest odds
  const currentOdds = history.length > 0 ? history[history.length - 1].yesOdds : "0";
  
  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">
        Current Yes Odds: {(Number(currentOdds) * 100).toFixed(0)}%
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={history} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <Line 
              type="linear"
              isAnimationActive={history.length > 1}
              animationDuration={500}
              dataKey="yesOdds" 
              stroke="#10b981" 
              key="yesOdds"
              dot={(props) => (
                <circle
                  key={`dot-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={props.index === history.length - 1 ? 4 : 0}
                  fill="#10b981"
                  strokeWidth={2}
                />
              )}
              strokeWidth={2}
              name="Yes Probability"
            />
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#94a3b8"
              opacity={1}
              strokeWidth={0.5}
            />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(time) => {
                const date = new Date(time);
                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
              }}
              tick={{ fontSize: 12 }}
              ticks={[history[0]?.timestamp]}
            />
            <YAxis 
              domain={[0, 1]} 
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              orientation="right"
              tick={{ 
                fontSize: 12,
                dy: 0,
                textAnchor: 'start',
                dominantBaseline: 'auto'
              }}
              axisLine={false}
              tickLine={true}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
            />
            <Tooltip 
              formatter={(value: any) => `${(Number(value) * 100).toFixed(1)}%`}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 