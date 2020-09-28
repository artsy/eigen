import {
  Fair2ExhibitorRailTestsQuery,
  Fair2ExhibitorRailTestsQueryRawResponse,
} from "__generated__/Fair2ExhibitorRailTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { Fair2ExhibitorRailFragmentContainer } from "../Components/Fair2ExhibitorRail"

jest.unmock("react-relay")

describe("FairExhibitors", () => {
  const getWrapper = (fixture = FAIR_2_EXHIBITOR_RAIL_FIXTURE) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2ExhibitorRailTestsQuery>
        environment={env}
        query={graphql`
          query Fair2ExhibitorRailTestsQuery($showID: String!) @raw_response_type {
            show(id: $showID) {
              ...Fair2ExhibitorRail_show
            }
          }
        `}
        variables={{ showID: "gagosian-at-art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.show) {
            return null
          }

          return <Fair2ExhibitorRailFragmentContainer show={props.show} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation({ errors: [], data: fixture })

    return tree
  }

  it("renders an exhibitor rail", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root)).toContain("First Partner Has Artworks")
  })
})

const FAIR_2_EXHIBITOR_RAIL_FIXTURE: Fair2ExhibitorRailTestsQueryRawResponse = {
  show: {
    id: "xxx-2",
    internalID: "xxx-2",
    counts: { artworks: 10 },
    href: "/show/example-2",
    partner: {
      __typename: "Partner",
      id: "example-2",
      name: "First Partner Has Artworks",
    },
    artworks: {
      edges: [
        {
          node: {
            href: "/artwork/cool-artwork-1",
            artistNames: "Andy Warhol",
            id: "abc124",
            saleMessage: "For Sale",
            image: {
              aspectRatio: 1.2,
              imageURL: "image.jpg",
            },
            saleArtwork: null,
            sale: null,
            title: "Best Artwork Ever",
            internalID: "artwork1234",
            slug: "cool-artwork-1",
          },
        },
        {
          node: {
            href: "/artwork/cool-artwork-1",
            artistNames: "Andy Warhol",
            id: "abc125",
            saleMessage: "For Sale",
            image: {
              aspectRatio: 1.2,
              imageURL: "image.jpg",
            },
            saleArtwork: null,
            sale: null,
            title: "Best Artwork Ever",
            internalID: "artwork1234",
            slug: "cool-artwork-1",
          },
        },
        {
          node: {
            href: "/artwork/cool-artwork-1",
            artistNames: "Andy Warhol",
            id: "abc126",
            saleMessage: "For Sale",
            image: {
              aspectRatio: 1.2,
              imageURL: "image.jpg",
            },
            saleArtwork: null,
            sale: null,
            title: "Best Artwork Ever",
            internalID: "artwork1234",
            slug: "cool-artwork-1",
          },
        },
      ],
    },
  },
}
