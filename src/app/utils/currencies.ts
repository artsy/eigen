export type Currency = "EUR" | "USD" | "GBP"

export const CURRENCIES: Array<{
  label: string
  value: Currency
}> = [
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
  { label: "£ GBP", value: "GBP" },
]
