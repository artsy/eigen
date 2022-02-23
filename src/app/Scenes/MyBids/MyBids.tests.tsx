import { MyBidsTestsQuery } from "__generated__/MyBidsTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { PlaceholderText } from "app/utils/placeholders"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ActiveLotStanding } from "./Components/ActiveLotStanding"
import { ClosedLotStanding } from "./Components/ClosedLotStanding"
import { WatchedLot } from "./Components/WatchedLot"
import { MyBidsContainer, MyBidsQueryRenderer } from "./MyBids"

jest.unmock("react-relay")

const closedSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const closedSection = root.findByProps({ testID: "closed-section" })
  return closedSection.findAllByType(ClosedLotStanding)
}

const activeSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const activeSection = root.findByProps({ testID: "active-section" })
  const ActiveLotStandings = activeSection.findAll((instance: ReactTestInstance) => {
    return [ActiveLotStanding, ClosedLotStanding, WatchedLot].includes((instance as any).type)
  })

  return ActiveLotStandings
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
          return <MyBidsContainer isActiveTab me={props!.me!} />
        } else if (Boolean(error)) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
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
          liveStartAt: "2020-08-10T16:00:00+00:00",
        }

        const saleArtworks = [
          {
            isHighestBidder: true,
            internalID: "saleartworks1",
            lotState: {
              soldStatus: "Passed",
            },
            sale,
          },
        ]

        return {
          myBids: {
            closed: [{ sale, saleArtworks }],
          },
        }
      },
    })

    const ClosedLotStandings = closedSectionLots(wrapper.root).map(extractText)
    expect(ClosedLotStandings[0]).toContain("artistNames")
    expect(ClosedLotStandings[0]).toContain("Passed")
    expect(ClosedLotStandings[0]).toContain("Closed Aug 13")
  })

  it("renders a completed lot in an ongoing live sale in the 'active' section", () => {
    const wrapper = getWrapper({
      Me: () => {
        const sale = {
          internalID: "sale-id",
          status: "open",
          liveStartAt: "2020-08-13T16:00:00+00:00",
        }

        const saleArtworks = [
          {
            internalID: "saleartworks1",
            lotState: {
              soldStatus: "Passed",
              reserveStatus: "ReserveNotMet",
            },
            sale,
          },
        ]
        return {
          myBids: {
            active: [{ sale, saleArtworks }],
          },
        }
      },
    })

    const ActiveLotStandings = activeSectionLots(wrapper.root).map(extractText)
    expect(ActiveLotStandings[0]).toContain("Passed")
  })

  it("renders the empty view when there are no lots to show", () => {
    const wrapper = getWrapper({
      Me: () => ({
        myBids: {
          active: [],
          closed: [],
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
          myBids: {
            active: [{ saleArtworks: [] }],
          },
        }
      },
    })
    expect(extractText(wrapper.root)).toContain("You haven't placed any bids on this sale")
  })
})
