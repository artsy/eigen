import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ScrollView } from "react-native"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultQueryRenderer } from "../AuctionResult"

jest.unmock("react-relay")

describe("AuctionResult", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const renderAuctionResult = (mockedData = {}) => {
    const tree = renderWithWrappers(
      <AuctionResultQueryRenderer
        artistID="artist-id"
        auctionResultInternalID="auction-result-id"
        environment={mockEnvironment}
      />
    )
    mockEnvironmentPayload(mockEnvironment, mockedData)
    return tree
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without throwing an error", () => {
    const tree = renderAuctionResult()
    expect(tree.root.findByType(ScrollView)).toBeDefined()
  })

  it("renders with a StickyScrollHeader", () => {
    const tree = renderAuctionResult()
    expect(tree.root.findAllByType(FancyModalHeader)).toHaveLength(2)
  })

  it("calculates the ratio correctly", () => {
    const tree = renderAuctionResult({
      AuctionResult: () => ({
        estimate: {
          low: 200,
        },
        priceRealized: {
          cents: 450,
        },
      }),
    })
    expect(extractText(tree.root.findByProps({ testID: "ratio" }))).toContain("2.25x")
  })

  it("shows if a lot was bought in", () => {
    const tree = renderAuctionResult({
      AuctionResult: () => ({
        boughtIn: true,
        priceRealized: {
          display: false,
        },
      }),
    })
    expect(extractText(tree.root)).toContain("Bought in")
    expect(tree.root.findAllByProps({ testID: "ratio" })).toHaveLength(0)
  })

  it("shows the correct sale date", () => {
    const tree = renderAuctionResult({
      AuctionResult: () => ({
        saleDate: "2021-01-11T18:00:00-06:00",
      }),
    })
    expect(extractText(tree.root.findByProps({ testID: "saleDate" }))).toContain("Jan 12, 2021")
  })
})
