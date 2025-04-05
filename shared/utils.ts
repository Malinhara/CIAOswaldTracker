interface Prediction {
  position: string;
  amount: string;
  marketId: number;
}

export function calculateMarketOdds(predictions: Prediction[], marketId: number) {
  const marketPredictions = predictions.filter(p => p.marketId === marketId);
  
  const yesAmount = marketPredictions
    .filter(p => p.position.toLowerCase() === 'yes')
    .reduce((sum, p) => sum + Number(p.amount), 0);
    
  const noAmount = marketPredictions
    .filter(p => p.position.toLowerCase() === 'no')
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