import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionScreenArtworksTestsQuery } from "__generated__/HomeViewSectionScreenArtworksTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionScreenArtworks } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenArtworks"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionArtworks", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionScreenArtworksTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionScreenArtworks section={props.homeView.section} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionScreenArtworksTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-new-works-for-you") @required(action: NONE) {
            ... on HomeViewSectionArtworks {
              ...HomeViewSectionScreenArtworks_section
            }
          }
        }
      }
    `,
  })

  it("renders no artworks available when no artworks are available", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "New Works for You",
      }),
      ArtworkConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(screen.getByText(/Nothing yet. Please check back later/)).toBeOnTheScreen()
  })

  it("renders a list of artworks", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-new-works-for-you",
        component: {
          title: "New Works for You",
        },
        ownerType: "newWorksForYou",
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork-1-id",
                slug: "artwork-1-slug",
                title: "Artwork 1",
                href: "/artwork-1-href",
              },
            },
            {
              node: {
                internalID: "artwork-2-id",
                slug: "artwork-2-slug",
                title: "Artwork 2",
                href: "/artwork-2-href",
                collectorSignals: { primaryLabel: "PARTNER_OFFER", auction: null },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getAllByText("New Works for You")).toBeDefined()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Artwork 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedMainArtworkGrid",
            "context_module": "artworkGrid",
            "context_screen": undefined,
            "context_screen_owner_id": undefined,
            "context_screen_owner_slug": undefined,
            "context_screen_owner_type": "newWorksForYou",
            "destination_screen_owner_id": "artwork-2-id",
            "destination_screen_owner_slug": "artwork-2-slug",
            "destination_screen_owner_type": "artwork",
            "position": 1,
            "query": undefined,
            "signal_label": "Limited-Time Offer",
            "sort": undefined,
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/artwork-2-href")
  })
})
