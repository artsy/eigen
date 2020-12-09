import { MyBidsTestsQuery } from "__generated__/MyBidsTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { PlaceholderText } from "lib/utils/placeholders"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ActiveLot } from "../Components/ActiveLot"
import { ClosedLot } from "../Components/ClosedLot"
import { MyBidsContainer, MyBidsQueryRenderer } from "../MyBids"

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
    <QueryRenderer<MyBidsTestsQuery>
      environment={env}
      query={graphql`
        query MyBidsTestsQuery @relay_test_operation {
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

  describe("MyBidsQueryRenderer loading state", () => {
    it("shows placeholder until the operation resolves", () => {
      const tree = renderWithWrappers(<MyBidsQueryRenderer />)
      expect(tree.root.findAllByType(PlaceholderText).length).toBeGreaterThan(0)
    })
  })

  it("renders without throwing an error", () => {
    getWrapper()
  })

  it("renders a lot standing from a closed sale in the closed section", () => {
    const wrapper = getWrapper({
      Me: () => {
        const sale = {
          internalID: "sale1",
          endAt: "2020-08-13T16:00:00+00:00",
          timeZone: "America/New_York",
          status: "closed",
        }

        return {
          bidders: [],
          auctionsLotStandingConnection: {
            edges: [
              {
                node: {
                  isHighestBidder: true,
                  lotState: {
                    soldStatus: "Passed",
                  },
                  saleArtwork: {
                    sale,
                  },
                },
              },
            ],
          },
        }
      },
    })

    const closedLots = closedSectionLots(wrapper.root).map(extractText)
    expect(closedLots[0]).toContain("artistNames")
    expect(closedLots[0]).toContain("Passed")
    expect(closedLots[0]).toContain("Closed Aug 13")
  })

  it("renders a completed lot in an ongoing live sale in the 'active' column", () => {
    const wrapper = getWrapper({
      Me: () => {
        const sale = {
          internalID: "sale-id",
          status: "open",
          liveStartAt: "2020-08-13T16:00:00+00:00",
        }
        return {
          bidders: [
            {
              sale,
            },
          ],
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
                    sale,
                  },
                },
              },
            ],
          },
        }
      },
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

  // it("renders upon success")
})
