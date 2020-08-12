import {
  ArtistSeriesFullArtistSeriesListTestsQuery,
  ArtistSeriesFullArtistSeriesListTestsQueryRawResponse,
} from "__generated__/ArtistSeriesFullArtistSeriesListTestsQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { ArtistSeriesFullArtistSeriesListFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistSeriesListItem } from "lib/Scenes/ArtistSeries/ArtistSeriesListItem"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Full Artist Series List", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesFullArtistSeriesListTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesFullArtistSeriesListTestsQuery @raw_response_type {
          artist(id: "a-great-artist") {
            ...ArtistSeriesFullArtistSeriesList_artist
          }
        }
      `}
      variables={{ artistID: "a-great-artist" }}
      render={({ props, error }) => {
        if (props?.artist) {
          return <ArtistSeriesFullArtistSeriesListFragmentContainer artist={props.artist} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders the Full Artist Series Page Header", () => {
    const wrapper = () => {
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...ArtistSeriesFullArtistSeriesListFixture,
          },
        })
      })
      return tree
    }

    expect(wrapper().root.findByType(PageWithSimpleHeader).props.title).toBe("Artist Series")
  })

  it("renders the all of an artist's associated Artist Series", () => {
    const wrapper = () => {
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...ArtistSeriesFullArtistSeriesListFixture,
          },
        })
      })
      return tree
    }

    expect(wrapper().root.findAllByType(ArtistSeriesListItem)).toHaveLength(6)
  })
})

const ArtistSeriesFullArtistSeriesListFixture: ArtistSeriesFullArtistSeriesListTestsQueryRawResponse = {
  artist: {
    id: "yayoi-kusama",
    artistSeriesConnection: {
      edges: [
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
            slug: "yayoi-kusama-apples",
            internalID: "5856ee51-35eb-4b75-bb12-15a1cd7e012e",
            title: "apples",
            forSaleArtworksCount: 15,
            image: {
              url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
            },
          },
        },
        {
          node: {
            slug: "yayoi-kusama-grapefruit",
            internalID: "5856ee51-35eb-4b75-bb12-15a1816a9",
            title: "grapefruit",
            forSaleArtworksCount: 10,
            image: {
              url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
            },
          },
        },
        {
          node: {
            slug: "yayoi-kusama-dragonfruit",
            internalID: "5856ee51-35eb-4b75-bb12-15a1cd18161",
            title: "dragonfruit",
            forSaleArtworksCount: 8,
            image: {
              url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
            },
          },
        },
      ],
    },
  },
}
