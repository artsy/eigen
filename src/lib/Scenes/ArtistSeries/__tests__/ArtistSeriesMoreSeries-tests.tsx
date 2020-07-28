import { Theme } from "@artsy/palette"
import {
  ArtistSeriesMoreSeriesTestsQuery,
  ArtistSeriesMoreSeriesTestsQueryRawResponse,
} from "__generated__/ArtistSeriesMoreSeriesTestsQuery.graphql"
import { ArtistSeriesMoreSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("ArtistSeriesMoreSeries", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesMoreSeriesTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesMoreSeriesTestsQuery @raw_response_type {
          artistSeries(id: $artistSeriesID) {
            artist: artists(size: 1) {
              ...ArtistSeriesMoreSeries_artist
            }
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          const artist = props.artistSeries.artist[0]
          return (
            <Theme>
              <ArtistSeriesMoreSeriesFragmentContainer artist={artist} />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        } else {
          console.log("should not reach this")
        }
      }}
    />
  )

  const getWrapper = (testFixture: any) => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...testFixture,
        },
      })
    })
    return tree
  }

  describe("with at least one other series related to the artist to show", () => {
    it("renders the related artist series", () => {
      const wrapper = getWrapper(ArtistSeriesMoreSeriesFixture)
      expect(wrapper.root.findAllByType(ArtistSeriesMoreSeries))
    })
  })

  describe("with no other series related to the artist to show", () => {
    it("does not render", () => {

    })
  })
})

const ArtistSeriesMoreSeriesNoArtistFixture: ArtistSeriesMoreSeriesTestsQueryRawResponse = {
  artistSeries: {
    artist: [],
  },
}

const ArtistSeriesMoreSeriesNoSeriesFixture: ArtistSeriesMoreSeriesTestsQueryRawResponse = {
  artistSeries: {
    artist: [
      {
        id: "abc123",
        artistSeriesConnection: {
          edges: [],
        },
      },
    ],
  },
}

const ArtistSeriesMoreSeriesFixture: ArtistSeriesMoreSeriesTestsQueryRawResponse = {
  artistSeries: {
    artist: [
      {
        id: "abc123",
        artistSeriesConnection: {
          edges: [
            {
              node: {
                slug: "yayoi-kusama-pumpkins",
                internalID: "58597ef5-3390-406b-b6d2-d4e308125d0d",
                title: "Pumpkins",
                forSaleArtworksCount: 25,
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg",
                },
              },
            },
            {
              node: {
                slug: "yayoi-kusama-apricots",
                internalID: "ecfa5731-9d64-4bc2-9f9f-c427a9126064",
                title: "apricots",
                forSaleArtworksCount: 35,
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/Oymspr9llGzRC-lTZA8htA/main.jpg",
                },
              },
            },
            {
              node: {
                slug: "yayoi-kusama-plums",
                internalID: "da821a13-92fc-49c2-bbd5-bebb790f7020",
                title: "plums",
                forSaleArtworksCount: 40,
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/bLKO-OQg8UOzKuKcKxXeWQ/main.jpg",
                },
              },
            },
            {
              node: {
                slug: "yayoi-kusama-apples",
                internalID: "5856ee51-35eb-4b75-bb12-15a1cd7e012e",
                title: "apples",
                forSaleArtworksCount: 4,
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
                },
              },
            },
          ],
        },
      },
    ],
  },
}
