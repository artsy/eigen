import { screen } from "@testing-library/react-native"
import { RelatedArtistsRailTestQuery } from "__generated__/RelatedArtistsRailTestQuery.graphql"
import { RelatedArtistsRail } from "app/Components/Artist/RelatedArtistsRail"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("RelatedArtistsRail", () => {
  const { renderWithRelay } = setupTestWrapper<RelatedArtistsRailTestQuery>({
    Component: ({ artist }) => {
      const artists = extractNodes(artist?.related?.artistsConnection)
      return <RelatedArtistsRail artists={artists} artist={artist as any} />
    },
    query: graphql`
      query RelatedArtistsRailTestQuery @relay_test_operation {
        artist(id: "artist-id") {
          related {
            artistsConnection(first: 2) {
              edges {
                node {
                  ...RelatedArtistsRail_artists
                }
              }
            }
          }
          ...RelatedArtistsRailCell_artist
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText("Related Artists")).toBeOnTheScreen()
    expect(screen.getByText(/mock-value-for-field-"name"/)).toBeOnTheScreen()
  })
})
