import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistAboutShowsTestsQuery } from "__generated__/ArtistAboutShowsTestsQuery.graphql"
import { ArtistAboutShowsFragmentContainer } from "app/Components/Artist/ArtistAbout/ArtistAboutShows"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistAboutShows", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutShowsTestsQuery>({
    Component: (props) => <ArtistAboutShowsFragmentContainer artist={props.artist!} />,
    query: graphql`
      query ArtistAboutShowsTestsQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistAboutShows_artist
        }
      }
    `,
  })

  it("returns nothing if the user has no past/running/upcoming events", async () => {
    await renderWithRelay({ ShowConnection: () => ({ edges: [] }) })

    // component doesn't render anything
    expect(screen.toJSON()).toBe(null)
  })

  it("returns list of shows if the user has running events", async () => {
    await renderWithRelay({
      Artist: () => ({ name: "Andy Warhol" }),
      ShowConnection: () => mockShows,
    })

    expect(screen.getByText("Shows Featuring Andy Warhol")).toBeOnTheScreen()
    expect(screen.getAllByTestId("show-item-visit-show-link").length).toBeGreaterThan(0)
  })

  it("tracks a tap on a show", async () => {
    await renderWithRelay({
      Artist: () => ({ internalID: "artist-id", slug: "artist-slug" }),
      ShowConnection: () => ({
        edges: [
          { node: { internalID: "show-1", slug: "show-one", name: "Show One" } },
          { node: { internalID: "show-2", slug: "show-two", name: "Show Two" } },
        ],
      }),
    })

    await fireEvent.press(screen.getByText("Show Two"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "tappedShowGroup",
    "context_module": "currentShowsRail",
    "context_screen_owner_id": "artist-id",
    "context_screen_owner_slug": "artist-slug",
    "context_screen_owner_type": "artist",
    "destination_screen_owner_id": "show-2",
    "destination_screen_owner_slug": "show-two",
    "destination_screen_owner_type": "show",
    "horizontal_slide_position": 2,
    "type": "thumbnail",
  },
]
`)
  })

  it("tracks a tap on a show's cover image", async () => {
    await renderWithRelay({
      Artist: () => ({ internalID: "artist-id", slug: "artist-slug" }),
      ShowConnection: () => ({
        edges: [{ node: { internalID: "show-1", slug: "show-one", name: "Show One" } }],
      }),
    })

    await fireEvent.press(screen.getByTestId("show-item-visit-show-link"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "tappedShowGroup",
    "context_module": "currentShowsRail",
    "context_screen_owner_id": "artist-id",
    "context_screen_owner_slug": "artist-slug",
    "context_screen_owner_type": "artist",
    "destination_screen_owner_id": "show-1",
    "destination_screen_owner_slug": "show-one",
    "destination_screen_owner_type": "show",
    "horizontal_slide_position": 1,
    "type": "thumbnail",
  },
]
`)
  })
})

const mockShowsConnection = new Array(10).fill({
  node: {
    show: "show",
    id: "show-id",
  },
})

const mockShows = {
  edges: mockShowsConnection,
}
