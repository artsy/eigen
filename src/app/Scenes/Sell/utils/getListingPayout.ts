import { formatMoney } from "app/Components/Input/MoneyInput/moneyInputHelpers"

export const ARTSY_FEE_RATE = 0.15

export const getListingPayout = (askingPrice: number) => {
  const fee = Math.round(askingPrice * ARTSY_FEE_RATE)
  return { fee, payout: askingPrice - fee }
}

export const formatUSD = (amount: number) => `US$${formatMoney(String(amount))}`
