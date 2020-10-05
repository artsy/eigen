import { Show2TestsQuery } from "__generated__/Show2TestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Show2, Show2FragmentContainer } from "../Show2"

jest.unmock("react-relay")

describe("Show2", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Show2TestsQuery>
      environment={env}
      query={graphql`
        query Show2TestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...Show2_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show2FragmentContainer show={props.show} />
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

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Show2)).toHaveLength(1)
  })

  it("renders a title", () => {
    const wrapper = getWrapper({
      Show: () => ({
        name: "The big show",
      }),
    })
    expect(wrapper.root.findAllByType(Show2)).toHaveLength(1)
    expect(extractText(wrapper.root)).toContain("The big show")
  })
})
