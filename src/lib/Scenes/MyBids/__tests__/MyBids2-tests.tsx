import { MyBids2TestsQuery } from "__generated__/MyBids2TestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ClosedLot } from "../Components/ClosedLot"
import { MyBidsContainer } from "../MyBids"

jest.unmock("react-relay")

const closedSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const closedSection = root.findByProps({ "data-test-id": "closed-section" })
  return closedSection.findAllByType(ClosedLot)
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

  it("renders the no upcoming bids view when there are no active bids", () => {
    const wrapper = getWrapper({
      Me: () => ({
        auctionsLotStandingConnection: {
          edges: [],
        },
      }),
    })

    expect(extractText(wrapper.root)).toContain("No bidding history")
    expect(extractText(wrapper.root)).toContain(
      "Watch a live auction and place bids in advance or in real time, or you can bid in our curated timed auction"
    )
  })

  it("renders the no bidding history view when there are no closed bids", () => {
    const wrapper = getWrapper({
      Me: () => ({
        auctionsLotStandingConnection: {
          edges: [],
        },
      }),
    })

    expect(extractText(wrapper.root)).toContain("No bidding history")
    expect(extractText(wrapper.root)).toContain(
      "Watch a live auction and place bids in advance or in real time, or you can bid in our curated timed auction"
    )
  })
})
