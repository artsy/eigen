import { Fair2TestsQuery, Fair2TestsQueryRawResponse } from "__generated__/Fair2TestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { Fair2Header } from "../Components/Fair2Header"
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
})

const Fair2Fixture: Fair2TestsQueryRawResponse = {
  fair: {
    name: "Art Basel Hong Kong 2020",
    slug: "art-basel-hong-kong-2020",
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
  },
}
