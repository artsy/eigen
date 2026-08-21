import type { BidIncrementRule } from "app/Scenes/LiveSale/types/liveAuction"

// Mirrors the native minimumNextBidCentsIncrement algorithm:
// find the highest-threshold rule whose `from` is <= current price, add its `amount`.
const nextBidCents = (currentCents: number, rules: BidIncrementRule[]): number | null => {
  const rule = rules.filter((r) => r.from <= currentCents).sort((a, b) => b.from - a.from)[0]

  return rule ? currentCents + rule.amount : null
}

export const computeBidAmounts = (
  askingPriceCents: number,
  rules: BidIncrementRule[],
  maxCount = 20
): number[] => {
  if (!rules.length || askingPriceCents <= 0) {
    return askingPriceCents > 0 ? [askingPriceCents] : []
  }

  const amounts: number[] = []
  let current = askingPriceCents

  while (amounts.length < maxCount) {
    amounts.push(current)
    const next = nextBidCents(current, rules)
    if (next === null || next === current) break
    current = next
  }

  return amounts
}
