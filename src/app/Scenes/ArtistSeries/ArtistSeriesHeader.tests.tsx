import { ArtistSeriesHeaderTestsQuery } from "__generated__/ArtistSeriesHeaderTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Artist Series Header", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesHeaderTestsQuery>
      environment={env}
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
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...ArtistSeriesHeaderFixture,
          },
        })
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
