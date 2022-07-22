import { tappedCollectedArtwork } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { MyCollectionArtworkListItemTestsQuery } from "__generated__/MyCollectionArtworkListItemTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

describe("MyCollectionArtworkListItem", () => {
  const TestRenderer = () => {
    return (
      <QueryRenderer<MyCollectionArtworkListItemTestsQuery>
        environment={getMockRelayEnvironment()}
        query={graphql`
          query MyCollectionArtworkListItemTestsQuery @relay_test_operation {
            artwork(id: "artwork-id") {
              ...MyCollectionArtworkListItem_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return <MyCollectionArtworkListItem artwork={props.artwork} />
          }
          return null
        }}
      />
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the fields correctly", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
        },
        image: null,
        medium: "artwork medium",
      }),
    })

    expect(getByTestId("no-artwork-icon")).toBeTruthy()
    expect(getByTestId("artwork-title")).toBeTruthy()
    expect(getByTestId("artwork-date")).toBeTruthy()
    expect(getByTestId("artwork-medium")).toBeTruthy()
  })

  it("navigates to artwork details on tap", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
        },
        images: null,
        medium: "artwork medium",
      }),
    })

    const touchable = getByTestId("list-item-touchable")
    fireEvent.press(touchable)

    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork/artwork-slug", {
      passProps: {
        medium: "artwork medium",
        artistInternalID: "artist-id",
      },
    })
  })

  it("tracks analytics event on tap", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
        },
        images: null,
        medium: "artwork medium",
      }),
    })

    const touchable = getByTestId("list-item-touchable")
    fireEvent.press(touchable)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tappedCollectedArtwork({
        destinationOwnerId: "artwork-id",
        destinationOwnerSlug: "artwork-slug",
      })
    )
  })

  it("renders the high demand icon if the artists is P1 and demand rank is over 9", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
          targetSupply: {
            isP1: true,
          },
        },
        medium: "artwork medium",
        marketPriceInsights: {
          demandRank: 0.91,
        },
      }),
    })

    expect(getByTestId("test-high-demand-icon")).toBeTruthy()
  })
})
