import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionFeaturedCollectionTestQuery } from "__generated__/HomeViewSectionFeaturedCollectionTestQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionFeaturedCollection } from "app/Scenes/HomeView/Sections/HomeViewSectionFeaturedCollection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionFeaturedCollection", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionFeaturedCollectionTestQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionFeaturedCollection section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionFeaturedCollectionTestQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-foo-bar-collection-artworks") {
            ... on HomeViewSectionArtworks {
              ...HomeViewSectionFeaturedCollection_section
            }
          }
        }
      }
    `,
  })

  it("does not render the section if no artworks are available", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "The Foo Bar Collection",
      }),

      ArtworkConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(screen.queryByText("The Foo Bar Collection")).not.toBeOnTheScreen()
    expect(screen.toJSON()).toBeNull()
  })

  it("renders a list of artworks", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-foo-bar-collection-artworks",
        component: {
          title: "The Foo Bar Collection",
        },
        artworksConnection: {
          edges: [
            {
              node: {
                title: "Artwork 1",
              },
            },
            {
              node: {
                title: "Artwork 2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("The Foo Bar Collection")).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()
  })

  describe("tapping on view-all", () => {
    it("fires an event and navigates", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          contextModule: "fooBarRail",
          component: {
            behaviors: {
              viewAll: {
                buttonText: "Browse All Artworks",
                href: "/foo-bar-artworks",
                ownerType: "collection",
              },
            },
          },
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                },
              },
            ],
          },
        }),
      })

      fireEvent.press(screen.getByText(/Browse All Artworks/))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "tappedArtworkGroup",
          context_module: "fooBarRail",
          context_screen_owner_type: "home",
          destination_screen_owner_type: "collection",
          type: "viewAll",
        })
      )

      expect(navigate).toHaveBeenCalledWith("/foo-bar-artworks")
    })
  })

  describe("tapping on an artwork", () => {
    it("fires an event and navigates", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          contextModule: "fooBarRail",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  title: "Artwork 1",
                  slug: "artwork-1-slug",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      fireEvent.press(screen.getByText(/Artwork 1/))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "tappedArtworkGroup",
          context_module: "fooBarRail",
          context_screen_owner_type: "home",
          destination_screen_owner_id: "artwork-1-id",
          destination_screen_owner_slug: "artwork-1-slug",
        })
      )

      expect(navigate).toHaveBeenCalledWith("/artwork-1-href")
    })
  })
})
