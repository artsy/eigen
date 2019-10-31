import { ArtworkTestsQuery } from "__generated__/ArtworkTestsQuery.graphql"
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { Environment, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Artwork, ArtworkContainer } from "../Artwork"
import { ContextCard } from "../Components/ContextCard"

const trackEvent = jest.fn()

jest.unmock("react-relay")

describe("Artwork", () => {
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it.only("renders a snapshot", () => {
    const environment = createMockEnvironment()
    const TestRenderer = () => (
      <QueryRenderer<ArtworkTestsQuery>
        environment={(environment as any) as Environment}
        query={graphql`
          query ArtworkTestsQuery {
            artwork(id: "doesn't matter") {
              ...Artwork_artwork
            }
          }
        `}
        variables={{
          citySlug: "new-york-ny-usa",
          maxInt: 42,
        }}
        render={({ props, error }) => {
          if (props) {
            return <ArtworkContainer artwork={props.artwork} isVisible />
          } else {
            console.log(error)
          }
        }}
      />
    )
    const renderer = ReactTestRenderer.create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation, {
        // ID(_, generateId) {
        //   // Why we're doing this?
        //   // To make sure that we will generate a different set of ID
        //   // for elements on first page and the second page.
        //   return `first-page-id-${generateId()}`
        // },
        // PageInfo() {
        //   return {
        //     has_next_page: true,
        //   }
        // },
      })
    })
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it("refetches on re-appear", () => {
    const refetchMock = jest.fn()
    const component = mount(
      <Artwork
        artwork={ArtworkFixture as any}
        relay={({ environment: {}, refetch: refetchMock } as unknown) as RelayRefetchProp}
        isVisible
      />
    )
    component.setProps({ isVisible: false })
    component.setProps({ isVisible: true })
    expect(refetchMock).toHaveBeenCalled()
  })

  it("does not show a contextCard if the work is in a non-auction sale", () => {
    const nonAuctionSaleArtwork = {
      ...ArtworkFixture,
      context: {
        __typename: "Sale",
        isAuction: false,
      },
    }

    const component = mount(
      <Artwork artwork={nonAuctionSaleArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
    )
    expect(component.find(ContextCard).length).toEqual(0)
  })

  it("does show a contextCard if the work is in an auction", () => {
    const auctionSaleArtwork = { ...ArtworkFixture, context: { __typename: "Sale", isAuction: true } }

    const component = mount(
      <Artwork artwork={auctionSaleArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
    )
    expect(component.find(ContextCard).length).toEqual(1)
  })
})
