import { MyBids2TestsQuery } from "__generated__/MyBids2TestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ActiveLot } from "../Components/ActiveLot"
import { ClosedLot } from "../Components/ClosedLot"
import { MyBidsContainer } from "../MyBids"

jest.unmock("react-relay")

const closedSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const closedSection = root.findByProps({ "data-test-id": "closed-section" })
  return closedSection.findAllByType(ClosedLot)
}

const activeSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const activeSection = root.findByProps({ "data-test-id": "active-section" })
  const activeLots = activeSection.findAllByType(ActiveLot)
  const closedLots = activeSection.findAllByType(ClosedLot)
  return [...activeLots, ...closedLots]
}

describe("My Bids", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<MyBids2TestsQuery>
      environment={env}
      query={graphql`
        query MyBids2TestsQuery @relay_test_operation {
          me {
            ...MyBids_me
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (Boolean(props?.me)) {
          return <MyBidsContainer me={props!.me!} />
        } else if (Boolean(error)) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders without throwing an error", () => {
    getWrapper()
  })

  it("renders a lot standing from a closed sale in the closed section", () => {
    const wrapper = getWrapper({
      Me: () => ({
        auctionsLotStandingConnection: {
          edges: [
            {
              node: {
                isHighestBidder: true,
                lotState: {
                  soldStatus: "Passed",
                },
                saleArtwork: {
                  sale: {
                    endAt: "2020-08-13T16:00:00+00:00",
                    timeZone: "America/New_York",
                    status: "closed",
                  },
                },
              },
            },
          ],
        },
      }),
    })

    const closedLots = closedSectionLots(wrapper.root).map(extractText)
    expect(closedLots[0]).toContain("artistNames")
    expect(closedLots[0]).toContain("Passed")
    expect(closedLots[0]).toContain("Closed Aug 13")
  })

  it("renders a completed lot in an ongoing live sale in the 'active' column", () => {
    const wrapper = getWrapper({
      Me: () => ({
        auctionsLotStandingConnection: {
          edges: [
            {
              node: {
                isHighestBidder: true,
                lotState: {
                  soldStatus: "Passed",
                  reserveStatus: "ReserveNotMet",
                },
                saleArtwork: {
                  saleId: "sale-id",
                  sale: {
                    internalID: "sale-id",
                    status: "open",
                    liveStartAt: "2020-08-13T16:00:00+00:00",
                  },
                },
              },
            },
          ],
        },
      }),
    })

    const activeLots = activeSectionLots(wrapper.root).map(extractText)
    expect(activeLots[0]).toContain("Passed")
  })

  it("renders the empty view when there are no active bids", () => {
    const wrapper = getWrapper({
      Me: () => ({
        auctionsLotStandingConnection: {
          edges: [],
        },
      }),
    })

    expect(extractText(wrapper.root)).toContain("Discover works for you at auction")
    expect(extractText(wrapper.root)).toContain(
      "Browse and bid in auctions around the world, from online-only sales to benefit auctions—all in the Artsy app"
    )
  })

  it("renders the empty view when there are no closed bids", () => {
    const wrapper = getWrapper({
      Me: () => ({
        auctionsLotStandingConnection: {
          edges: [],
        },
      }),
    })

    expect(extractText(wrapper.root)).toContain("Discover works for you at auction")
    expect(extractText(wrapper.root)).toContain(
      "Browse and bid in auctions around the world, from online-only sales to benefit auctions—all in the Artsy app"
    )
  })
})
