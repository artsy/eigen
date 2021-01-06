import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ScrollView } from "react-native"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
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
    mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockedData))
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
})

//   it("renders auction is closed when an auction has passed", () => {
//     const tree = renderWithWrappers(<TestRenderer />)

//     mockEnvironment.mock.resolveMostRecentOperation((operation) =>
//       MockPayloadGenerator.generate(operation, {
//         Sale: () => ({
//           endAt: moment().subtract(1, "day").toISOString(),
//           startAt: "2020-09-01T15:00:00",
//           timeZone: "Europe/Berlin",
//           coverImage: {
//             url: "cover image url",
//           },
//           name: "sale name",
//           liveStartAt: "2020-09-01T15:00:00",
//           internalID: "the-sale-internal",
//         }),
//       })
//     )

//     expect(extractText(tree.root.findAllByType(OpaqueImageView)[0])).toBe("Auction closed")
//   })

//   it("does not render auction is closed when an auction is still active", () => {
//     const tree = renderWithWrappers(<TestRenderer />)

//     mockEnvironment.mock.resolveMostRecentOperation((operation) =>
//       MockPayloadGenerator.generate(operation, {
//         Sale: () => ({
//           endAt: moment().add(1, "day").toISOString(),
//           startAt: "2020-09-01T15:00:00",
//           timeZone: "Europe/Berlin",
//           coverImage: {
//             url: "cover image url",
//           },
//           name: "sale name",
//           liveStartAt: "2020-09-01T15:00:00",
//           internalID: "the-sale-internal",
//         }),
//       })
//     )

//     expect(extractText(tree.root.findAllByType(OpaqueImageView)[0])).not.toContain("Auction closed")
//   })
// })
