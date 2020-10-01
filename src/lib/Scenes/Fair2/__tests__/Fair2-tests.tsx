import { Fair2TestsQuery, Fair2TestsQueryRawResponse } from "__generated__/Fair2TestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { Fair2ArtworksFragmentContainer } from "../Components/Fair2Artworks"
import { Fair2CollectionsFragmentContainer } from "../Components/Fair2Collections"
import { Fair2EditorialFragmentContainer } from "../Components/Fair2Editorial"
import { Fair2ExhibitorsFragmentContainer } from "../Components/Fair2Exhibitors"
import { Fair2Header, Fair2HeaderFragmentContainer } from "../Components/Fair2Header"
import { Tabs } from "../Components/SimpleTabs"
import { Fair2, Fair2FragmentContainer } from "../Fair2"

jest.unmock("react-relay")

describe("Fair2", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Fair2TestsQuery>
      environment={env}
      query={graphql`
        query Fair2TestsQuery($fairID: String!) @raw_response_type {
          fair(id: $fairID) {
            ...Fair2_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2020" }}
      render={({ props, error }) => {
        if (props?.fair) {
          return <Fair2FragmentContainer fair={props.fair} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (testFixture: Fair2TestsQueryRawResponse) => {
    const tree = renderWithWrappers(<TestRenderer />)
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

  it("renders without throwing an error", () => {
    const wrapper = getWrapper(Fair2Fixture)
    expect(wrapper.root.findAllByType(Fair2)).toHaveLength(1)
  })

  it("renders the necessary subcomponents", () => {
    const wrapper = getWrapper(Fair2Fixture)
    expect(wrapper.root.findAllByType(Fair2Header)).toHaveLength(1)
  })

  it("does not render components when there is no data for them", () => {
    const noDataFixture = {
      fair: {
        ...Fair2Fixture.fair,
        articles: {
          edges: [],
        },
        marketingCollections: [],
        counts: {
          artworks: 0,
          partnerShows: 0,
        },
      },
    } as Fair2TestsQueryRawResponse

    const wrapper = getWrapper(noDataFixture)
    expect(wrapper.root.findAllByType(Fair2HeaderFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2EditorialFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2CollectionsFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Tabs)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2ExhibitorsFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2ArtworksFragmentContainer)).toHaveLength(0)
  })

  it("renders the collections component if there are collections", () => {
    const collectionDataFixture = {
      fair: {
        ...Fair2Fixture.fair,
        marketingCollections: [
          {
            __typename: "MarketingCollection",
            id: "1223456",
            slug: "collection-1",
            title: "First collection",
            category: "prints",
            artworks: null,
          },
          {
            __typename: "MarketingCollection",
            id: "1223456",
            slug: "collection-1",
            title: "First collection",
            category: "prints",
            artworks: null,
          },
        ],
      },
    } as Fair2TestsQueryRawResponse

    const wrapper = getWrapper(collectionDataFixture)
    expect(wrapper.root.findAllByType(Fair2CollectionsFragmentContainer)).toHaveLength(1)
  })

  it("renders the editorial component if there are articles", () => {
    const editorialDataFixture = {
      fair: {
        ...Fair2Fixture.fair,
        articles: {
          edges: [
            {
              __typename: "Article",
              node: {
                id: "sssss",
                title: "Great Article",
                href: "/article/great-article",
                publishedAt: "2020-11-02",
                thumbnailImage: {
                  src: "great-image.jpg",
                },
              },
            },
          ],
        },
      },
    } as Fair2TestsQueryRawResponse

    const wrapper = getWrapper(editorialDataFixture)
    expect(wrapper.root.findAllByType(Fair2EditorialFragmentContainer)).toHaveLength(1)
  })

  it("renders the artworks/exhibitors component and tabs if there are artworks and exhibitors", () => {
    const artworksDataFixture = {
      fair: {
        ...Fair2Fixture.fair,
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      },
    } as Fair2TestsQueryRawResponse
    const wrapper = getWrapper(artworksDataFixture)
    expect(wrapper.root.findAllByType(Tabs)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2ExhibitorsFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2ArtworksFragmentContainer)).toHaveLength(0)
  })
})

const Fair2Fixture: Fair2TestsQueryRawResponse = {
  fair: {
    name: "Art Basel Hong Kong 2020",
    slug: "art-basel-hong-kong-2020",
    internalID: "fair1244",
    about:
      "Following the cancelation of Art Basel in Hong Kong, Artsy is providing independent coverage of our partners galleries’ artworks intended for the fair. Available online from March 20th through April 3rd, the online catalogue features premier galleries from Asia and beyond. Concurrent with Artsy’s independent promotion, Art Basel is launching its Online Viewing Rooms, which provide exhibitors with an additional platform to present their program and artists to Art Basel's global network of collectors, buyers, and art enthusiasts.\r\n\r\n",
    summary: "",
    id: "xyz123",
    image: {
      aspectRatio: 1,
      url: "https://testing.artsy.net/art-basel-hong-kong-image",
    },
    location: {
      id: "cde123",
      summary: null,
    },
    profile: {
      id: "abc123",
      icon: {
        url: "https://testing.artsy.net/art-basel-hong-kong-icon",
      },
    },
    tagline: "",
    links: null,
    contact: null,
    hours: null,
    tickets: null,
    ticketsLink: "",
    articles: { edges: [] },
    marketingCollections: [],
    counts: {
      artworks: 0,
      partnerShows: 0,
    },
    fairArtworks: null,
    exhibitors: null,
    exhibitionPeriod: "Aug 19 - Sep 19",
    startAt: "2020-08-19T08:00:00+00:00",
    endAt: "2020-09-19T08:00:00+00:00",
  },
}
