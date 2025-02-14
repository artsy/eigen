import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArtworksTestsQuery } from "__generated__/HomeViewSectionArtworksTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArtworks } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworks"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionArtworks", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHidingDislikedArtworks: true })
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionArtworksTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionArtworks section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionArtworksTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-new-works-for-you") {
            ... on HomeViewSectionArtworks {
              ...HomeViewSectionArtworks_section @arguments(enableHidingDislikedArtworks: true)
            }
          }
        }
      }
    `,
  })

  it("renders nothing when no artworks", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "New Works for You",
      }),
      ArtworkConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of artworks", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-new-works-for-you",
        component: {
          title: "New Works for You",
        },
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

    expect(screen.getByText("New Works for You")).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Artwork 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedArtworkGroup",
            "context_module": "<mock-value-for-field-"contextModule">",
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "artwork-2-id",
            "destination_screen_owner_slug": "artwork-2-slug",
            "destination_screen_owner_type": "artwork",
            "horizontal_slide_position": 1,
            "module_height": "single",
            "signal_label": "Limited-Time Offer",
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/artwork-2-href")
  })

  it("does not render disliked artworks when enabled", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-new-works-for-you",
        contextModule: "newWorksForYouRail",
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork-1-id",
                slug: "artwork-1-slug",
                title: "Artwork 1",
                href: "/artwork-1-href",
                isDisliked: true,
              },
            },
          ],
        },
      }),
    })

    expect(screen.queryByText(/Artwork 1/)).not.toBeOnTheScreen()
  })
})
