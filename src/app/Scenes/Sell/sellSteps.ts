export type SellStepName = "SelectWorks" | "Condition" | "LocationAndContact"

interface SellStep {
  name: SellStepName
  title: string
  description: string
  /** Replaces the title and description for works going to auction */
  auction?: { title: string; description: string }
}

export const SELL_STEPS: SellStep[] = [
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
    auction: {
      title: "Condition",
      description: "Confirm the condition of the work.",
    },
  },
  {
    name: "LocationAndContact",
    title: "Shipping Options",
    description: "Tell us how the work will get to its buyer.",
    auction: {
      title: "Location & Contact",
      description: "Tell us how the work will get to its buyer.",
    },
  },
]

export const WORKS_SUMMARY_DESCRIPTION =
  "We reviewed demand for these works and selected the most effective sales channels for each piece. Confirm condition, price and shipping to finish listing."
