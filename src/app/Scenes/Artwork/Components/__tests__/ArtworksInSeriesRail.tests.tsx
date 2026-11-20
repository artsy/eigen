import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworksInSeriesRailTestsQuery } from "__generated__/ArtworksInSeriesRailTestsQuery.graphql"
import { ArtworksInSeriesRail } from "app/Scenes/Artwork/Components/ArtworksInSeriesRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Mock memo to return the same instance of the component
// issue: https://github.com/facebook/react/issues/17301
jest.mock("react", () => {
  const actualReact = jest.requireActual("react")
  return {
    ...actualReact,
    memo: (component: React.ComponentType<any>) => component,
  }
})

describe("ArtworksInSeriesRail", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworksInSeriesRailTestsQuery>({
    Component: ({ artwork }) => <ArtworksInSeriesRail artwork={artwork!} />,
    query: graphql`
      query ArtworksInSeriesRailTestsQuery @raw_response_type @relay_test_operation {
        artwork(id: "some-artwork") {
          ...ArtworksInSeriesRail_artwork
        }
      }
    `,
  })

  it("renders each artwork in the artist series", async () => {
    await renderWithRelay({
      Artwork: () => ({
        artistSeriesConnection: {
          edges: [
            {
              node: {
                slug: "alex-katz-departure",
                title: "Alex Katz: Departure",
                filterArtworksConnection: {
                  id: "katz124",
                  edges: [
                    {
                      node: {
                        title: "test artwork 1",
                        slug: "/test-artwork-1",
                      },
                    },
                    {
                      node: {
                        title: "test artwork 2",
                      },
                    },
                    {
                      node: {
                        title: "test artwork 3",
                      },
                    },
                    {
                      node: {
                        title: "test artwork 4",
                      },
                    },
                    {
                      node: {
                        title: "test artwork 5",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getAllByTestId("artwork-rail-card-image")).toHaveLength(5)
  })

  it("navigates to the artist series when the header is tapped", async () => {
    await renderWithRelay({
      Artwork: () => ({
        artistSeriesConnection: {
          edges: [
            {
              node: {
                slug: "alex-katz-departure",
              },
            },
          ],
        },
      }),
    })

    await fireEvent.press(screen.getByText("More From This Series"))

    expect(navigate).toHaveBeenCalledWith("/artist-series/alex-katz-departure")
  })

  it("tracks clicks to the View series button", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "artwork124",
        slug: "my-cool-artwork",
        artistSeriesConnection: {
          edges: [
            {
              node: {
                slug: "alex-katz-departure",
                internalID: "katz124",
                filterArtworksConnection: {
                  id: "abcabc",
                  edges: [
                    {
                      node: {
                        id: "abc123",
                        isSaved: false,
                        slug: "alex-katz-departure-28",
                        internalID: "5a20271ccd530e50722ae2df",
                        href: "/artwork/alex-katz-departure-28",
                        title: "Departure",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    await fireEvent.press(screen.getByText("More From This Series"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "moreFromThisSeries",
      context_screen_owner_id: "artwork124",
      context_screen_owner_slug: "my-cool-artwork",
      context_screen_owner_type: "artwork",
      destination_screen_owner_id: "katz124",
      destination_screen_owner_slug: "alex-katz-departure",
      destination_screen_owner_type: "artistSeries",
      type: "viewAll",
    })
  })

  it("tracks clicks on an individual artwork", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "artwork124",
        slug: "my-cool-artwork",
        collectorSignals: null,
        artistSeriesConnection: {
          edges: [
            {
              node: {
                slug: "alex-katz-departure-28",
                id: "abctest",
              },
            },
          ],
        },
      }),
    })

    await fireEvent.press(screen.getByTestId("artwork-my-cool-artwork"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "moreFromThisSeries",
      context_screen_owner_id: "artwork124",
      context_screen_owner_slug: "my-cool-artwork",
      context_screen_owner_type: "artwork",
      destination_screen_owner_id: "artwork124",
      destination_screen_owner_slug: "my-cool-artwork",
      destination_screen_owner_type: "artwork",
      type: "thumbnail",
    })
  })

  it("tracks clicks on an individual artwork with a partner offer", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "artwork124",
        slug: "my-cool-artwork",
        collectorSignals: {
          primaryLabel: "PARTNER_OFFER",
          auction: null,
        },
        artistSeriesConnection: {
          edges: [
            {
              node: {
                slug: "alex-katz-departure-28",
                id: "abctest",
              },
            },
          ],
        },
      }),
    })

    await fireEvent.press(screen.getByTestId("artwork-my-cool-artwork"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "moreFromThisSeries",
      context_screen_owner_id: "artwork124",
      context_screen_owner_slug: "my-cool-artwork",
      context_screen_owner_type: "artwork",
      destination_screen_owner_id: "artwork124",
      destination_screen_owner_slug: "my-cool-artwork",
      destination_screen_owner_type: "artwork",
      type: "thumbnail",
      signal_label: "Limited-Time Offer",
    })
  })

  it("tracks clicks on an individual artwork with auction signals", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "artwork124",
        slug: "my-cool-artwork",
        collectorSignals: {
          primaryLabel: null,
          auction: { bidCount: 7, lotWatcherCount: 49 },
        },
        artistSeriesConnection: {
          edges: [{ node: { slug: "alex-katz-departure-28", id: "abctest" } }],
        },
      }),
    })

    await fireEvent.press(screen.getByTestId("artwork-my-cool-artwork"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "moreFromThisSeries",
      context_screen_owner_id: "artwork124",
      context_screen_owner_slug: "my-cool-artwork",
      context_screen_owner_type: "artwork",
      destination_screen_owner_id: "artwork124",
      destination_screen_owner_slug: "my-cool-artwork",
      destination_screen_owner_type: "artwork",
      type: "thumbnail",
      signal_label: "",
      signal_bid_count: 7,
      signal_lot_watcher_count: 49,
    })
  })
})
