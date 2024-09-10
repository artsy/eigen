import { screen } from "@testing-library/react-native"
import { ArtistSeriesMetaTestsQuery } from "__generated__/ArtistSeriesMetaTestsQuery.graphql"
import { ArtistSeriesMetaFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Artist Series Meta", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistSeriesMetaTestsQuery>({
    Component: ({ artistSeries }) => (
      <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries!} />
    ),
    query: graphql`
      query ArtistSeriesMetaTestsQuery @raw_response_type @relay_test_operation {
        artistSeries(id: "pumpkins") {
          ...ArtistSeriesMeta_artistSeries
        }
      }
    `,
  })

  it("renders the Artist Series title and description", () => {
    renderWithRelay({
      ArtistSeries: () => ({
        title: "These are the Pumpkins",
        description: "A deliciously artistic variety of painted pumpkins.",
      }),
    })

    expect(screen.getByText("These are the Pumpkins")).toBeOnTheScreen()
    expect(
      screen.getByText("A deliciously artistic variety of painted pumpkins.")
    ).toBeOnTheScreen()
    expect(screen.getByText("More series by this artist")).toBeOnTheScreen()
  })
})
