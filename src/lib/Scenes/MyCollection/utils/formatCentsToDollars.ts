export function formatCentsToDollars(value: number) {
  const CENTS_IN_DOLLAR = 100

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(Math.round(value / CENTS_IN_DOLLAR))
    .replace(".00", "")
}
