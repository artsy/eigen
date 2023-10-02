import { screen } from "@testing-library/react-native"
import { RelatedArtistsRailTestQuery } from "__generated__/RelatedArtistsRailTestQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { RelatedArtistsRail } from "./RelatedArtistsRail"

describe("RelatedArtistsRail", () => {
  const { renderWithRelay } = setupTestWrapper<RelatedArtistsRailTestQuery>({
    Component: ({ artistsConnection }) => {
      const artists = extractNodes(artistsConnection)
      return <RelatedArtistsRail artists={artists} />
    },
    query: graphql`
      query RelatedArtistsRailTestQuery @relay_test_operation {
        artistsConnection(first: 2) {
          edges {
            node {
              ...RelatedArtistsRail_artists
            }
          }
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
