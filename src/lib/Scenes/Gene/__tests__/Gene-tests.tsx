// Stub out these views for simplicity sake
jest.mock("lib/Components/Gene/Header", () => "Header")

import { Gene } from "../Gene"

const exampleProps = {
  input: {
    medium: "propupines",
    priceRange: "1000-80000",
    sort: "-desc",
  },
  gene: { filtered_artworks: { aggregations: [] } },
}

describe("state", () => {
  it("sets up the initial state", () => {
    const gene = new Gene({
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      gene: null,
      medium: "glitch",
      price_range: "*-*",
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay: null,
    })

    expect(gene.state).toEqual({
      selectedTabIndex: 0,
      showingStickyHeader: true,
      sort: "-partner_updated_at",
      selectedMedium: "glitch",
      selectedPriceRange: "*-*",
    })
  })

  it("updates from the switch change the selectedTabIndex", () => {
    const gene = new Gene(exampleProps as any)
    const switchEvent = { selectedTabIndex: 1 }

    gene.setState = jest.fn()
    gene.switchSelectionDidChange(1)

    expect(gene.setState).lastCalledWith(switchEvent)
  })
})

describe("handling price ranges", () => {
  let gene: Gene

  beforeEach(() => {
    gene = new Gene(exampleProps as any)
  })

  it("is empty when *-*", () => {
    expect(gene.priceRangeToHumanReadableString("*-*")).toEqual("")
  })

  it("looks right when there is only a min value", () => {
    expect(gene.priceRangeToHumanReadableString("50.00-*")).toEqual("Above $50")
  })

  it("looks right when there is only a max value", () => {
    expect(gene.priceRangeToHumanReadableString("*-100.00")).toEqual("Below $100")
  })

  it("looks right when there is a max and mix value", () => {
    expect(gene.priceRangeToHumanReadableString("100.00-10000.00")).toEqual("$100 - $10,000")
  })
})
