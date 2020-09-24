import {
  Fair2EditorialTestsQuery,
  Fair2EditorialTestsQueryRawResponse,
} from "__generated__/Fair2EditorialTestsQuery.graphql"
import { Fair2EditorialFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2Editorial"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text, Touchable } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

const FAIR_2_EDITORIAL_FIXTURE: Fair2EditorialTestsQueryRawResponse = {
  fair: {
    id: "art-basel-hong-kong-2020",
    articles: {
      edges: [
        {
          node: {
            id: "QXJ0aWNsZTo1ZTdiZDEzM2ZmNTc3NjAwMWYyOTg2YTI=",
            title: "What Sold at Art Basel in Hong Kong’s Online Viewing Rooms",
            href: "/article/artsy-editorial-sold-art-basel-hong-kongs-online-viewing-rooms",
            publishedAt: "Mar 26th, 20",
            thumbnailImage: {
              src: "https://example.com?example.jpg",
            },
          },
        },
        {
          node: {
            id: "QXJ0aWNsZTo1ZTZmYTNmMWI3N2Y0NTAwMjA3MzdmNTg=",
            title: "In the Midst of COVID-19, Chinese Galleries Adapt and Persevere",
            href: "/article/artsy-editorial-midst-covid-19-chinese-galleries-adapt-persevere",
            publishedAt: "Mar 17th, 20",
            thumbnailImage: {
              src: "https://example.com?example.jpg",
            },
          },
        },
      ],
    },
  },
}

describe("Fair2Editorial", () => {
  const getWrapper = (fixture = FAIR_2_EDITORIAL_FIXTURE) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2EditorialTestsQuery>
        environment={env}
        query={graphql`
          query Fair2EditorialTestsQuery($fairID: String!) @raw_response_type {
            fair(id: $fairID) {
              ...Fair2Editorial_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }

          return <Fair2EditorialFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation({ errors: [], data: fixture })

    return tree
  }

  it("renders the 2 articles", () => {
    const wrapper = getWrapper()

    const links = wrapper.root.findAllByType(Touchable)
    expect(links).toHaveLength(2)

    const text = wrapper.root
      .findAllByType(Text)
      .map(({ props: { children } }) => children)
      .join()

    expect(text).toContain("What Sold at Art Basel in Hong Kong’s Online Viewing Rooms")
    expect(text).toContain("In the Midst of COVID-19, Chinese Galleries Adapt and Persevere")
  })

  it("renders null if there are no articles", () => {
    const wrapper = getWrapper({
      fair: {
        ...FAIR_2_EDITORIAL_FIXTURE.fair,
        id: "art-basel-hong-kong-2020",
        articles: {
          edges: [],
        },
      },
    })

    expect(wrapper.toJSON()).toBe(null)
  })
})
