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
import { WatchedLot } from "../Components/WatchedLot"
import { MyBidsContainer, MyBidsQueryRenderer } from "../MyBids"

jest.unmock("react-relay")

const closedSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const closedSection = root.findByProps({ "data-test-id": "closed-section" })
  return closedSection.findAllByType(ClosedLot)
}

const activeSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const activeSection = root.findByProps({ "data-test-id": "active-section" })
  const activeLots = activeSection.findAll((instance: ReactTestInstance) => {
    return [ActiveLot, ClosedLot, WatchedLot].includes((instance as any).type)
  })

  return activeLots
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
          return <MyBidsContainer isActiveTab={true} me={props!.me!} />
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
          watchedLotConnection: {
            edges: [],
          },
          auctionsLotStandingConnection: {
            edges: [
              {
                node: {
                  isHighestBidder: true,
                  lot: {
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

  it("renders a completed lot in an ongoing live sale in the 'active' section", () => {
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
          watchedLotConnection: {
            edges: [],
          },
          auctionsLotStandingConnection: {
            edges: [
              {
                node: {
                  isHighestBidder: true,
                  lot: {
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

  // TODO: This needs to be updated to test for when there no active, closed, or watched lot standings
  it("renders the empty view when there are no lots to show", () => {
    const wrapper = getWrapper({
      Me: () => ({
        bidders: [],
        watchedLotConnection: {
          edges: [],
        },
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

  it("tells a user they have no bids on a registered sale", () => {
    const wrapper = getWrapper({
      Me: () => {
        return {
          bidders: [
            {
              sale: {
                registrationStatus: {
                  qualifiedForBidding: true,
                },
              },
            },
          ],
          watchedLotConnection: {
            edges: [],
          },
          auctionsLotStandingConnection: {
            edges: [],
          },
        }
      },
    })
    expect(extractText(wrapper.root)).toContain("You haven't placed any bids on this sale")
  })

  describe("when a user is watching lots", () => {
    it("renders a watched lot for a sale the user has not registered for", () => {
      const wrapper = getWrapper({
        Me: () => ({
          bidders: [],
          auctionsLotStandingConnection: { edges: [] },
          watchedLotConnection: {
            edges: [
              {
                node: {
                  saleArtwork: {
                    sale: {
                      registrationStatus: null,
                    },
                  },
                },
              },
            ],
          },
        }),
      })
      expect(extractText(wrapper.root)).toContain("Complete registration")
    })

    it("renders a watched lot for a sale with a pending registration", () => {
      const wrapper = getWrapper({
        Me: () => ({
          bidders: [],
          auctionsLotStandingConnection: { edges: [] },
          watchedLotConnection: {
            edges: [
              {
                node: {
                  saleArtwork: {
                    sale: {
                      registrationStatus: { qualifiedForBidding: false },
                    },
                  },
                },
              },
            ],
          },
        }),
      })
      expect(extractText(wrapper.root)).toContain("Registration pending")
    })

    it("does not render a watched lot that also has a bid", () => {
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
            watchedLotConnection: {
              edges: [
                {
                  node: {
                    lot: {
                      internalID: "same-id",
                    },
                    saleArtwork: {
                      artwork: {
                        artistNames: "Watched artist",
                      },
                    },
                  },
                },
              ],
            },
            auctionsLotStandingConnection: {
              edges: [
                {
                  node: {
                    lot: {
                      internalID: "same-id",
                    },
                    saleArtwork: {
                      artwork: {
                        artistNames: "Lot standing artist",
                      },
                    },
                  },
                },
              ],
            },
          }
        },
      })

      const activeLots = activeSectionLots(wrapper.root).map(extractText)
      expect(activeLots.length).toEqual(1)
      expect(activeLots[0]).toContain("Lot standing artist")
      expect(activeLots[0]).not.toContain("Watched artist")
    })

    it("renders a watched lot in the active section ordered by lot position", () => {
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
            watchedLotConnection: {
              edges: [
                {
                  node: {
                    lot: {
                      internalID: "Unique id",
                      soldStatus: "Passed",
                      reserveStatus: "ReserveNotMet",
                    },
                    saleArtwork: {
                      sale,
                      position: 2,
                      lotLabel: "#2",
                      artwork: {
                        artistNames: "Watched artist",
                      },
                    },
                  },
                },
              ],
            },
            auctionsLotStandingConnection: {
              edges: [
                {
                  node: {
                    lot: {
                      soldStatus: "Passed",
                      reserveStatus: "ReserveNotMet",
                    },
                    saleArtwork: {
                      position: 1,
                      lotLabel: "#1",
                      artwork: {
                        artistNames: "Lot standing artist 1",
                      },
                      sale,
                    },
                  },
                },
                {
                  node: {
                    lot: {
                      soldStatus: "Sold",
                      reserveStatus: "ReserveMet",
                    },
                    saleArtwork: {
                      position: 3,
                      lotLabel: "#3",
                      artwork: {
                        artistNames: "Lot standing artist 3",
                      },
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
      expect(activeLots[0]).toContain("Lot standing artist 1Lot #1")
      expect(activeLots[1]).toContain("Watched artistLot #2")
      expect(activeLots[2]).toContain("Lot standing artist 3Lot #3")
    })
  })
})
