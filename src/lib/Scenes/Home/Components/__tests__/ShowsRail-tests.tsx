import { ShowsRailTestsQuery } from "__generated__/ShowsRailTestsQuery.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { first } from "lodash"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ShowsRailFragmentContainer } from "../ShowsRail"

jest.unmock("react-relay")

const showEdge = {
  cursor: "YXJyYXljb25uZWN0aW9uOjA=",
  node: {
    name: "Leeum Collection: Beyond Space",
    id: "U2hvdzo1OGE1M2YzYzc2MjJkZDQxNmY3YTNjNGQ=",
    metaImage: {
      url: "https://d32dm0rphc51dk.cloudfront.net/vWq6mRB9uyvfhA1JT1xH_A/larger.jpg",
    },
    internalID: "58a53f3c7622dd416f7a3c4d",
    slug: "leeum-samsung-museum-of-art-leeum-collection-beyond-space",
    href: "/show/leeum-samsung-museum-of-art-leeum-collection-beyond-space",
    status: "running",
    startAt: "2014-08-19T12:00:00+00:00",
    endAt: "2999-12-31T12:00:00+00:00",
    artists: null,
    partner: {
      name: "Leeum, Samsung Museum of Art",
    },
  },
}
const meResponseMock = {
  me: [
    {
      showsByFollowedArtists: {
        totalCount: 20,
        edges: [showEdge, showEdge, showEdge],
      },
    },
  ],
}

describe("ShowsRailFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ShowsRailTestsQuery>
      environment={env}
      query={graphql`
        query ShowsRailTestsQuery @raw_response_type {
          showsConnection {
            ...ShowsRail_showsConnection
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return <ShowsRailFragmentContainer showsConnection={props.showsConnection!} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("doesn't throw when rendered", () => {
    renderWithWrappers(<TestRenderer />)
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: meResponseMock,
        }),
      })
    )
  })

  it("routes to shows URL", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: meResponseMock,
        }),
      })
    )

    first(tree.root.findAllByType(SectionTitle))?.props.onPress()
    expect(navigate).toHaveBeenCalledWith("/shows")
  })
})
