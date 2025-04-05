import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Evidence, User, Vote } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

type EvidenceSubmission = {
  title: string;
  content: string;
  text: string;
  marketId?: number;
  evidenceType: 'yes' | 'no';
};

type EvidenceWithRelations = Evidence & {
  user?: User;
  votes?: Vote[];
  text?: string;
};

export function useEvidence(marketId: number | null = null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch evidence
  const { data: evidence = [], isLoading } = useQuery<EvidenceWithRelations[]>({
    queryKey: ['/api/evidence', marketId],
    queryFn: async () => {
      const url = `/api/evidence${marketId !== undefined ? `?marketId=${marketId}` : ''}`;
      console.log('Fetching evidence from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch evidence');
      }
      const data = await response.json();
      console.log('Fetched evidence data:', data);
      return data;
    },
  });

  // Mutation to submit new evidence
  const submitMutation = useMutation({
    mutationFn: async (data: EvidenceSubmission) => {
      console.log('Submitting evidence:', { ...data, marketId });
      const response = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          marketId: marketId,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Evidence submission failed:', errorText);
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('Evidence submission response:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/evidence', marketId] });
      toast({
        title: "Success",
        description: "Evidence submitted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Evidence submission error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to vote on evidence
  const voteMutation = useMutation({
    mutationFn: async ({ evidenceId, isUpvote }: { evidenceId: number; isUpvote: boolean }) => {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidenceId, isUpvote }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/evidence', marketId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    evidence,
    isLoading,
    submit: submitMutation.mutate,
    vote: voteMutation.mutate,
  };
}