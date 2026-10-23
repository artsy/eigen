export const SELL_STEPS = [
  {
    name: "SelectWorks",
    title: "Decide Which Works to Sell",
    description:
      "Tap the works you've considered selling. We'll review demand for each and let you know if we can help today.",
  },
  {
    name: "Condition",
    title: "Condition & Price",
    description: "Confirm the condition and set a price for the work.",
  },
  {
    name: "LocationAndContact",
    title: "Shipping Options",
    description: "Tell us how the work will get to its buyer.",
  },
] as const

export type SellStepName = (typeof SELL_STEPS)[number]["name"]

export const WORKS_SUMMARY_DESCRIPTION =
  "We reviewed demand for these works and selected the most effective sales channels for each piece. Confirm condition, price and shipping to finish listing."
