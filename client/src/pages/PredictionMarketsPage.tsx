import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Plus, Home } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Market } from "@db/schema";
import { useState } from "react";

export default function PredictionMarketsPage() {

  console.log(`before query`);
  
  const { data: markets = [] } = useQuery<Market[]>({
    queryKey: ['/api/markets'],
    queryFn: () => fetch('/api/markets').then(res => res.json())
  });
  

  console.log(`markets: ${markets}`);

  // Sort markets by total market size (descending)
  const sortedMarkets = [...markets].sort((a, b) => {
    const aTotal = Number(a.yesAmount) + Number(a.noAmount);
    const bTotal = Number(b.yesAmount) + Number(b.noAmount);
    return bTotal - aTotal;  // Descending order
  });

  console.log('do we get here twice?');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary">Tinfoil</h2>
              <p className="text-sm text-muted-foreground">Question It All</p>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Active Prediction Markets</h1>

          <div className="space-y-4">
            {sortedMarkets.map((market, index) => (
              <Link key={market.id} href={`/predict/${market.id}`} className="block">
                <Card className="hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {index + 1}. {market.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {market.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-sm text-muted-foreground">
                            Market Answer: {Number(market.currentOdds) >= 0.5 ? (
                              <span className="text-green-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-red-600 font-medium">No</span>
                            )}
                          </span>
                          <span className="mx-1">|</span>
                          <span className="text-sm text-muted-foreground">
                            Market Size: ${Math.floor(Number(market.yesAmount) + Number(market.noAmount))}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}