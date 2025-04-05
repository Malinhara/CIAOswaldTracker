import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvidence } from "@/hooks/use-evidence";
import { usePredictions } from "@/hooks/use-predictions";
import { ArrowUp, ArrowDown, FileText, Trophy, ThumbsUp, ThumbsDown, Trash2, Home, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Market } from "@db/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useParams } from 'wouter';
import { OddsChart } from "@/components/OddsChart";

// Helper function to extract domain from URL
function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

type EvidenceFormData = {
  title: string;
  content: string;
  text: string;
  evidenceType: 'yes' | 'no';
};

export default function PredictionPage() {
  const { id } = useParams();
  const marketId = Number(id);

  // Redirect to markets page if no marketId is provided
  if (!id) {
    window.location.href = '/markets';
    return null;
  }

  const { evidence, submit: submitEvidence, vote, isLoading: evidenceLoading } = useEvidence(marketId);
  const { predictions, submit, isLoading: predictionsLoading } = usePredictions();
  const [betAmount, setBetAmount] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const { data: market, refetch: refetchMarket } = useQuery({
    queryKey: ['market', id],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${id}`);
      const data = await response.json();
      return data;
    }
  });

  // Add this to see the market data whenever it changes
  useEffect(() => {
    if (market) {
      console.log('Market Data Updated:', {
        id: market.id,
        yesAmount: market.yesAmount,
        noAmount: market.noAmount,
        currentOdds: market.currentOdds
      });
    }
  }, [market]);

  const evidenceForm = useForm<EvidenceFormData>({
    defaultValues: {
      title: '',
      content: '',
      text: '',
      evidenceType: 'yes'
    }
  });

  // Display loading state while market data is being fetched
  if (!market) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  const onEvidenceSubmit = (data: EvidenceFormData) => {
    submitEvidence({
      title: data.title,
      content: data.content,
      text: data.text,
      marketId: marketId,
      evidenceType: data.evidenceType,
    });
    evidenceForm.reset();
  };

  // Filter and sort evidence based on vote score
  const getVoteScore = (item: any) => {
    const upvotes = item.votes?.filter((v: { value: number }) => v.value === 1).length ?? 0;
    const downvotes = item.votes?.filter((v: { value: number }) => v.value === -1).length ?? 0;
    return upvotes - downvotes;
  };

  // Sort evidence by vote score (highest first)
  const yesEvidence = evidence
    .filter(item => item.evidenceType === 'yes')
    .sort((a, b) => getVoteScore(b) - getVoteScore(a));

  const noEvidence = evidence
    .filter(item => item.evidenceType === 'no')
    .sort((a, b) => getVoteScore(b) - getVoteScore(a));

  // Function to handle bet submission with delayed refetch
  const handleBet = async (position: 'yes' | 'no') => {
    await submit({ 
      marketId,
      position,
      amount: betAmount
    });

    // Wait 250ms then refetch market data and odds history
    setTimeout(async () => {
      await refetchMarket();
      // @ts-ignore
      if (window.refetchOddsHistory) {
        // @ts-ignore
        await window.refetchOddsHistory();
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary">Tinfoil</h2>
              <p className="text-sm text-muted-foreground">Question it All</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="ghost">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/markets/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Market
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{market?.title || 'Loading...'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Market Odds</h3>
                  <OddsChart marketId={marketId} />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-lg">Bet Amount ($)</Label>
                    <Input
                      type="number"
                      value={betAmount === 0 ? '' : betAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? parseInt(value.replace(/^0+/, '')) : 0;
                        setBetAmount(numValue);
                      }}
                      min={1}
                      max={100}
                      className="my-4"
                      placeholder="Enter bet amount"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleBet('yes')}
                      disabled={predictionsLoading}
                      className="w-full bg-green-500 hover:bg-green-600"
                      variant="default"
                    >
                      Yes {(Number(market.currentOdds) * 100).toFixed(0)}¢
                    </Button>
                    <Button
                      onClick={() => handleBet('no')}
                      disabled={predictionsLoading}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      variant="default"
                    >
                      No {((1 - Number(market.currentOdds)) * 100).toFixed(0)}¢
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Market Size: ${(Number(market.yesAmount) + Number(market.noAmount)).toFixed(0)}</p>
                  <p>Total Predictions: {predictions.filter(p => p.marketId === marketId).length}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Rules</h3>
                  
                  <div className="text-muted-foreground text-sm">
                    {/* Show either preview or full text */}
                    {showRules ? (
                      // Full text
                      <>
                        <p className="mb-4">{market?.yesResolution}</p>
                        <p>{market?.noResolution}</p>
                      </>
                    ) : (
                      // Preview only
                      <p>{market?.yesResolution?.split('.')[0]}...</p>
                    )}
                  </div>
                  
                  <Button 
                    variant="link" 
                    onClick={() => setShowRules(!showRules)}
                    className="text-blue-500 text-sm h-auto p-0 mt-1 flex items-center gap-1"
                  >
                    {showRules ? (
                      <>
                        Show Less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read More
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Evidence</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view-yes">
                <TabsList className="w-full">
                  <TabsTrigger value="view-yes" className="flex-1">View "Yes" Documents</TabsTrigger>
                  <TabsTrigger value="view-no" className="flex-1">View "No" Documents</TabsTrigger>
                  <TabsTrigger value="submit" className="flex-1">Submit Document</TabsTrigger>
                </TabsList>
                <TabsContent value="view-yes">
                  <div className="space-y-4">
                    {yesEvidence.map((item, index) => {
                      const upvotes = (item as any).votes?.filter((v: { value: number }) => v.value === 1).length ?? 0;
                      const downvotes = (item as any).votes?.filter((v: { value: number }) => v.value === -1).length ?? 0;
                      const voteScore = upvotes - downvotes;
                      const user = (item as any).user;
                      const reputation = user?.reputation ?? 0;
                      const domain = item.content?.startsWith('http') ? getDomainFromUrl(item.content) : null;
                      const titleWithDomain = domain ? `${item.title} (${domain})` : item.title;

                      return (
                        <Card key={item.id} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="mb-2 text-sm font-semibold text-primary flex items-center gap-2">
                                  #{index + 1}
                                  {reputation > 50 && (
                                    <Trophy className="h-4 w-4 text-yellow-500" aria-label="High Reputation User" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => vote({ evidenceId: item.id, isUpvote: true })}
                                  className="text-green-600 relative group"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">
                                  <Badge variant={voteScore > 0 ? "default" : "destructive"} className="text-xs">
                                    {voteScore}
                                  </Badge>
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => vote({ evidenceId: item.id, isUpvote: false })}
                                  className="text-red-600 relative group"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  {item.content?.startsWith('http') ? (
                                    <a
                                      href={item.content}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold hover:underline"
                                    >
                                      {titleWithDomain}
                                    </a>
                                  ) : (
                                    <h3 className="font-semibold">{titleWithDomain}</h3>
                                  )}
                                  <div className="ml-auto flex items-center gap-2">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      {upvotes}
                                      <ThumbsDown className="h-3 w-3 ml-2 mr-1" />
                                      {downvotes}
                                    </div>
                                  </div>
                                </div>
                                {(item as any).text && (
                                  <p className="mt-2 text-sm text-gray-600">{(item as any).text}</p>
                                )}
                                {(!item.content?.startsWith('http') && item.content !== 'none') && (
                                  <p className="mt-2 text-sm text-gray-600">{item.content}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="view-no">
                  <div className="space-y-4">
                    {noEvidence.map((item, index) => {
                      const upvotes = (item as any).votes?.filter((v: { value: number }) => v.value === 1).length ?? 0;
                      const downvotes = (item as any).votes?.filter((v: { value: number }) => v.value === -1).length ?? 0;
                      const voteScore = upvotes - downvotes;
                      const user = (item as any).user;
                      const reputation = user?.reputation ?? 0;
                      const actualContent = item.content;
                      const domain = actualContent && actualContent.startsWith('http') ? getDomainFromUrl(actualContent) : null;
                      const titleWithDomain = domain ? `${item.title} (${domain})` : item.title;

                      return (
                        <Card key={item.id} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="mb-2 text-sm font-semibold text-primary flex items-center gap-2">
                                  #{index + 1}
                                  {reputation > 50 && (
                                    <Trophy className="h-4 w-4 text-yellow-500" aria-label="High Reputation User" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => vote({ evidenceId: item.id, isUpvote: true })}
                                  className="text-green-600 relative group"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">
                                  <Badge variant={voteScore > 0 ? "default" : "destructive"} className="text-xs">
                                    {voteScore}
                                  </Badge>
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => vote({ evidenceId: item.id, isUpvote: false })}
                                  className="text-red-600 relative group"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  {actualContent && actualContent.startsWith('http') ? (
                                    <a
                                      href={actualContent}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold hover:underline"
                                    >
                                      {titleWithDomain}
                                    </a>
                                  ) : (
                                    <h3 className="font-semibold">{titleWithDomain}</h3>
                                  )}
                                  <div className="ml-auto flex items-center gap-2">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      {upvotes}
                                      <ThumbsDown className="h-3 w-3 ml-2 mr-1" />
                                      {downvotes}
                                    </div>
                                  </div>
                                </div>
                                {(item as any).text && (
                                  <p className="mt-2 text-sm text-gray-600">{(item as any).text}</p>
                                )}
                                {(!actualContent?.startsWith('http') && actualContent !== 'none') && (
                                  <p className="mt-2 text-sm text-gray-600">{actualContent}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="submit">
                  <form onSubmit={evidenceForm.handleSubmit(onEvidenceSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Evidence Type</Label>
                      <div className="flex flex-row space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="yes"
                            value="yes"
                            {...evidenceForm.register("evidenceType")}
                            defaultChecked
                            className="text-primary"
                          />
                          <Label htmlFor="yes">Yes Evidence</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="no"
                            value="no"
                            {...evidenceForm.register("evidenceType")}
                            className="text-primary"
                          />
                          <Label htmlFor="no">No Evidence</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., CIA Memo dated Sept 1963"
                        {...evidenceForm.register("title", { required: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">URL</Label>
                      <Input
                        id="content"
                        placeholder="Enter the URL of the document..."
                        {...evidenceForm.register("content", { required: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="text">Text</Label>
                      <Textarea
                        id="text"
                        placeholder="Enter the document text or analysis..."
                        {...evidenceForm.register("text", { required: true })}
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={evidenceLoading}>
                      Submit Document
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}