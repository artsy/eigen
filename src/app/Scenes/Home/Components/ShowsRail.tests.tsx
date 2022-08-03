import { ShowsRailTestsQuery } from "__generated__/ShowsRailTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { cloneDeep } from "lodash"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { ShowsRailFragmentContainer } from "./ShowsRail"

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
  const TestRenderer = () => (
    <QueryRenderer<ShowsRailTestsQuery>
      environment={getRelayEnvironment()}
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
          return (
            <ShowsRailFragmentContainer title="Shows" showsConnection={props.showsConnection!} />
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("doesn't throw when rendered", () => {
    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Query: () => ({
        me: meResponseMock,
      }),
    })
  })

  it("renders without throwing an error when missing shows", () => {
    const showsCopy = cloneDeep(meResponseMock)
    showsCopy.me.forEach((me) => {
      me.showsByFollowedArtists.edges = []
    })

    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Query: () => ({
        me: showsCopy,
      }),
    })
  })
})
