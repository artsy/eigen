import { ArtworkTestsQuery } from "__generated__/ArtworkTestsQuery.graphql"
import {
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  NotRegisteredToBid,
  RegisteredBidder,
} from "lib/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { Countdown } from "lib/Components/Bidding/Components/Timer"
import { merge } from "lodash"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkContainer } from "../Artwork"
import { BidButton } from "../Components/CommercialButtons/BidButton"
import { CommercialPartnerInformation } from "../Components/CommercialPartnerInformation"
import { ContextCard } from "../Components/ContextCard"

const trackEvent = jest.fn()

jest.unmock("react-relay")

describe("Artwork", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = ({ isVisible = true }) => (
    <QueryRenderer<ArtworkTestsQuery>
      environment={environment}
      query={graphql`
        query ArtworkTestsQuery @relay_test_operation {
          artwork(id: "doesn't matter") {
            ...Artwork_artwork
          }
        }
      `}
      variables={{ hello: true }}
      render={({ props, error }) => {
        if (props) {
          return <ArtworkContainer artwork={props.artwork} isVisible={isVisible} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    environment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders a snapshot", () => {
    const renderer = ReactTestRenderer.create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation)
    })
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it("marks the artwork as viewed", () => {
    ReactTestRenderer.create(<TestRenderer />)
    const slug = "test artwork id"

    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation, {
        Artwork() {
          return { slug }
        },
      })
    })

    expect(environment.mock.getMostRecentOperation()).toMatchObject({
      request: {
        variables: {
          input: {
            artwork_id: slug,
          },
        },
      },
    })
  })

  it("refetches on re-appear", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe("ArtworkTestsQuery")
    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation)
    })

    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "ArtworkMarkAsRecentlyViewedQuery"
    )
    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation)
    })

    expect(environment.mock.getAllOperations()).toHaveLength(0)

    tree.update(<TestRenderer isVisible={false} />)
    tree.update(<TestRenderer isVisible={true} />)

    expect(environment.mock.getAllOperations()).toHaveLength(2)

    expect(environment.mock.getAllOperations()[0].request.node.operation.name).toBe("ArtworkRefetchQuery")
    expect(environment.mock.getAllOperations()[1].request.node.operation.name).toBe("ArtworkMarkAsRecentlyViewedQuery")
  })

  it("does not show a contextCard if the work is in a non-auction sale", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation, {
        Sale() {
          return {
            isAuction: false,
          }
        },
      })
    })

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(0)
  })

  it("does show a contextCard if the work is in an auction", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation, {
        Sale() {
          return {
            isAuction: true,
          }
        },
      })
    })

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(1)
  })

  describe("Live Auction States", () => {
    describe("has the correct state for a work that is in an auction that is currently live", () => {
      it("for which I am registered", () => {
        const tree = ReactTestRenderer.create(<TestRenderer />)

        environment.mock.resolveMostRecentOperation(operation => {
          return MockPayloadGenerator.generate(operation, {
            Artwork() {
              return merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationClosed, RegisteredBidder)
            },
          })
        })

        expect(tree.root.findAllByType(CommercialPartnerInformation)).toHaveLength(0)
        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Enter live bidding")
      })

      it("for which I am not registered and registration is open", () => {
        const tree = ReactTestRenderer.create(<TestRenderer />)

        environment.mock.resolveMostRecentOperation(operation => {
          return MockPayloadGenerator.generate(operation, {
            Artwork() {
              return merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)
            },
          })
        })

        expect(tree.root.findAllByType(CommercialPartnerInformation)).toHaveLength(0)
        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Registration closed")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Watch live bidding")
      })

      it("for which I am not registered and registration is closed", () => {
        const tree = ReactTestRenderer.create(<TestRenderer />)

        environment.mock.resolveMostRecentOperation(operation => {
          return MockPayloadGenerator.generate(operation, {
            Artwork() {
              return merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
            },
          })
        })

        expect(tree.root.findAllByType(CommercialPartnerInformation)).toHaveLength(0)
        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(Countdown))).toContain("00d  00h  00m  00s")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Enter live bidding")
      })
    })
  })
})

const extractText = root => {
  let result = ""
  root.findAll(el => {
    if (el.type === "Text") {
      result += el.children[0]
    }
  })
  return result
}
