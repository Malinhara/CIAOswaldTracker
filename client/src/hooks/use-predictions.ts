import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Prediction } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

interface PredictionSubmission {
  marketId: number;
  position: 'yes' | 'no';
  amount: number;
}

export function usePredictions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: predictions = [], isLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions'],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PredictionSubmission) => {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/predictions'] });
      toast({
        title: "Success",
        description: "Prediction submitted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate market odds based on total bets
  const marketState = predictions.reduce((acc, p) => {
    if (p.position === 'yes') {
      acc.totalYes += Number(p.amount);
    } else {
      acc.totalNo += Number(p.amount);
    }
    return acc;
  }, { totalYes: 0, totalNo: 0 });

  const totalLiquidity = marketState.totalYes + marketState.totalNo;

  // Calculate probability using constant product formula
  // This creates a price impact - larger bets move the price more
  const probability = totalLiquidity === 0 ? 0.5 : 
    marketState.totalYes / totalLiquidity;

  return {
    predictions,
    marketOdds: probability,
    totalLiquidity,
    yesAmount: marketState.totalYes,
    noAmount: marketState.totalNo,
    isLoading,
    submit: submitMutation.mutate,
  };
}