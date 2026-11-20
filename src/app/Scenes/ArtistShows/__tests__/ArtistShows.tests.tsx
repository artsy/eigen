import { screen } from "@testing-library/react-native"
import { ArtistShowsTestsQuery } from "__generated__/ArtistShowsTestsQuery.graphql"
import { ArtistShowsPaginationContainer } from "app/Scenes/ArtistShows/ArtistShows"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistShows", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistShowsTestsQuery>({
    Component: (props) => <ArtistShowsPaginationContainer artist={props.artist!} />,
    query: graphql`
      query ArtistShowsTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          slug
          ...ArtistShows_artist
        }
      }
    `,
  })

  it("Renders artist name", async () => {
    await renderWithRelay({
      Artist: () => ({
        name: "Andy Warhol",
      }),
    })

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("Past Shows")).toBeOnTheScreen()
  })

  it("Renders list of shows", async () => {
    await renderWithRelay({
      // ShowsConnection is named as ShowConnection
      ShowConnection: () => ({
        edges: [
          { node: { id: "show1", name: "Show One" } },
          { node: { id: "show2", name: "Show Two" } },
          { node: { id: "show3", name: "Show Three" } },
        ],
      }),
    })

    expect(screen.getByText("Show One")).toBeOnTheScreen()
    expect(screen.getByText("Show Two")).toBeOnTheScreen()
    expect(screen.getByText("Show Three")).toBeOnTheScreen()
  })
})
