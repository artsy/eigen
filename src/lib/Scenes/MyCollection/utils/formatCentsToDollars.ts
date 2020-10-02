export function formatCentsToDollars(value: number) {
  if (value < 0) {
    value = 0
  }

  const CENTS_IN_DOLLAR = 100

  return new Intl.NumberFormat("en-US", {
    style: "currency",

    // TODO: While artwork price insight stuff is all currently calculated
    // in dollars, we might need to return to this later.
    currency: "USD",
  })
    .format(Math.round(value / CENTS_IN_DOLLAR))
    .replace(".00", "")
}
