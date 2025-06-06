import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistShowTestsQuery } from "__generated__/ArtistShowTestsQuery.graphql"
import { ArtistShow } from "app/Components/Artist/ArtistShows/ArtistShow"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistShow", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistShowTestsQuery>({
    Component: ({ show }) => {
      return <ArtistShow show={show!} imageDimensions={{ width: 82, height: 82 }} index={0} />
    },
    query: graphql`
      query ArtistShowTestsQuery @relay_test_operation {
        show(id: "test-show") {
          ...ArtistShow_show
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({ Show: () => show })

    expect(screen.getByText("Gallery")).toBeOnTheScreen()
  })

  it("renders without throwing an error with null show kind", () => {
    renderWithRelay({
      Show: () => ({
        ...show,
        kind: null,
      }),
    })

    expect(screen.getByText("Gallery")).toBeOnTheScreen()
  })

  it("navigates to the respective show screen", () => {
    renderWithRelay({ Show: () => show })

    fireEvent.press(screen.getByText("Gallery"))

    expect(navigate).toHaveBeenCalledWith(show.href)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedShowGroup",
      context_module: "currentShowsRail",
      context_screen_owner_type: "artist",
      destination_screen_owner_id: "show-1",
      destination_screen_owner_slug: "show",
      destination_screen_owner_type: "show",
      horizontal_slide_position: 1,
      type: "thumbnail",
    })
  })
})

const show = {
  internalID: "show-1",
  slug: "show",
  href: "artsy.net/show",
  cover_image: {
    url: "artsy.net/image-url",
  },
  kind: "solo",
  name: "Expansive Exhibition",
  exhibition_period: "Jan 1 - March 1",
  status_update: "Closing in 2 days",
  status: "running",
  partner: {
    name: "Gallery",
  },
  location: {
    city: "Berlin",
  },
}
