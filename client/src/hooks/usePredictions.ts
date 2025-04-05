import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';

export interface PredictionSubmission {
  marketId: number;
  position: 'yes' | 'no';
  amount: number;
}

interface Prediction {
  position: 'yes' | 'no';
  amount: string;
  marketId: number;
}

// Calculate odds for a specific market based on its predictions
function calculateMarketOdds(predictions: Prediction[], marketId: number | null) {
  if (!marketId) return { marketOdds: 0.5, yesAmount: 0, noAmount: 0, totalLiquidity: 0 };
  
  const marketPredictions = predictions.filter(p => p.marketId === marketId);
  
  const yesAmount = marketPredictions
    .filter(p => p.position === 'yes')
    .reduce((sum, p) => sum + Number(p.amount), 0);
    
  const noAmount = marketPredictions
    .filter(p => p.position === 'no')
    .reduce((sum, p) => sum + Number(p.amount), 0);
    
  const totalAmount = yesAmount + noAmount;
  
  // If no bets yet, return 50-50 odds
  if (totalAmount === 0) return {
    marketOdds: 0.5,
    yesAmount,
    noAmount,
    totalLiquidity: 0
  };
  
  return {
    marketOdds: yesAmount / totalAmount,
    yesAmount,
    noAmount,
    totalLiquidity: totalAmount
  };
}

// This is a custom hook that manages predictions
export function usePredictions(marketId: number, refetchMarket?: () => void) {
  const queryClient = useQueryClient();
  // useState is a built-in React hook that lets you add state to functional components
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [marketData, setMarketData] = useState({
    marketOdds: 0.5,
    yesAmount: 0,
    noAmount: 0,
    totalLiquidity: 0
  });
  
  // useToast is another custom hook you're using for notifications
  const { toast } = useToast();

  // Add a state to trigger refetch
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Fetch predictions and calculate odds for this specific market
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/predictions');
      const data = await response.json();
      setPredictions(data);
      
      // Calculate odds specific to this market
      const odds = calculateMarketOdds(data, marketId);
      setMarketData(odds);
    };
    fetchData();
  }, [marketId, shouldRefetch]); // Refetch when shouldRefetch changes

  // This is a function that will be available to any component using this hook
  const submit = async (data: PredictionSubmission) => {
    try {
      setIsLoading(true);
      
      // Validate the data
      if (!data.marketId || !data.position || !data.amount) {
        throw new Error('Missing required fields');
      }

      console.log('Submitting prediction:', data);

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // After successful submission:
      await queryClient.invalidateQueries({ queryKey: ['market', data.marketId] });
      if (refetchMarket) {
        await refetchMarket();
      }

      toast({
        title: "Success",
        description: "Prediction submitted successfully",
      });

      // Trigger refetch after successful submission
      setTimeout(() => {
        setShouldRefetch(prev => !prev);
      }, 500); // Half second delay

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit prediction',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // The hook returns an object with values/functions that components can use
  return {
    predictions,
    submit,
    isLoading,
    ...marketData  // Spread the market data
  };
} 