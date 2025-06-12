import { screen } from "@testing-library/react-native"
import { ArtistSeriesHeaderTestsQuery } from "__generated__/ArtistSeriesHeaderTestsQuery.graphql"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Artist Series Header", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistSeriesHeaderTestsQuery>({
    Component: ({ artistSeries }) => (
      <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries!} />
    ),
    query: graphql`
      query ArtistSeriesHeaderTestsQuery @raw_response_type {
        artistSeries(id: "pumpkins") {
          ...ArtistSeriesHeader_artistSeries
        }
      }
    `,
  })

  it("renders the Artist Series header", () => {
    renderWithRelay({
      ArtistSeries: () => ({
        title: "Pumpkins",
        image: {
          url: "https://www.imagesofpumpkins.cloudfront.net/primary/square.jpg",
        },
      }),
    })

    expect(screen.getByText("Pumpkins")).toBeOnTheScreen()
    expect(screen.getByTestId("ArtistSeriesHeaderImage")).toBeOnTheScreen()
  })
})
