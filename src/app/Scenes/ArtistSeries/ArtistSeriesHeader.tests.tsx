import { ArtistSeriesHeaderTestsQuery } from "__generated__/ArtistSeriesHeaderTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperationRawPayload } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

describe("Artist Series Header", () => {
  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesHeaderTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query ArtistSeriesHeaderTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            ...ArtistSeriesHeader_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return <ArtistSeriesHeaderFragmentContainer artistSeries={props.artistSeries} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders the Artist Series header", () => {
    const wrapper = () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      resolveMostRecentRelayOperationRawPayload({
        errors: [],
        data: {
          ...ArtistSeriesHeaderFixture,
        },
      })

      return tree
    }

    expect(wrapper().root.findByType(OpaqueImageView).props.imageURL).toBe(
      "https://www.imagesofpumpkins.cloudfront.net/primary/square.jpg"
    )
  })
})

const ArtistSeriesHeaderFixture: ArtistSeriesHeaderTestsQuery["rawResponse"] = {
  artistSeries: {
    image: {
      url: "https://www.imagesofpumpkins.cloudfront.net/primary/square.jpg",
    },
  },
}
