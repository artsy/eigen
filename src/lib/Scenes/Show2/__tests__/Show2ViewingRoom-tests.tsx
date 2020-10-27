import { Show2ViewingRoomTestsQuery } from "__generated__/Show2ViewingRoomTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Show2ViewingRoomFragmentContainer } from "../Components/Show2ViewingRoom"

jest.unmock("react-relay")

describe("Show2ViewingRoom", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Show2ViewingRoomTestsQuery>
      environment={env}
      query={graphql`
        query Show2ViewingRoomTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...Show2ViewingRoom_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show2ViewingRoomFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders the viewing room card", () => {
    const wrapper = getWrapper({
      Partner: () => ({ name: "Example Partner" }),
      ViewingRoom: () => ({ title: "Example Viewing Room" }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Example Partner")
    expect(text).toContain("Example Viewing Room")
  })
})
