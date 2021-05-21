let mockRefineCallbackPromise = () => Promise.resolve({})
jest.mock("../../NativeModules/triggerRefine", () => ({
  triggerRefine: () => mockRefineCallbackPromise(),
}))

// Stub out these views for simplicity sake
jest.mock("../../Components/Gene/Header", () => "Header")

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

  // OK, this is a long one, but it's important.

  it("updates the state with new data from Eigen", () => {
    const gene = new Gene({
      medium: "glitch",
      price_range: "*-*",
      relay: { variables: {}, refetchConnection: jest.fn() } as any,
      gene: { artworks: { aggregations: [] } },
    } as any)
    gene.setState = jest.fn()

    // The data we expect back from Eigen when you've hit the refine button,
    // this is a promise that Eigen would normally resolve (via the modal)
    mockRefineCallbackPromise = () =>
      Promise.resolve({
        medium: "porcupines",
        selectedPrice: "1000-80000",
        sort: "-desc",
      })

    // Then when the gene has been tapped, it returns the refine data above
    return gene.refineTapped().then(() => {
      // This should trigger new state inside the component
      expect(gene.setState).lastCalledWith({
        selectedMedium: "porcupines",
        selectedPriceRange: "1000-80000",
        sort: "-desc",
      })

      // As well as trigger new state for Relay ( triggering a new call to metaphysics )
      expect(gene.props.relay.refetchConnection).lastCalledWith(10, undefined, {
        input: {
          medium: "porcupines",
          priceRange: "1000-80000",
          sort: "-desc",
        }
      })
    })
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
