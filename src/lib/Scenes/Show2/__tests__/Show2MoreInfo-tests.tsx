import { Show2MoreInfoTestsQuery } from "__generated__/Show2MoreInfoTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Show2MoreInfo, Show2MoreInfoFragmentContainer } from "../Screens/Show2MoreInfo"

jest.unmock("react-relay")

describe("Show2MoreInfo", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Show2MoreInfoTestsQuery>
      environment={env}
      query={graphql`
        query Show2MoreInfoTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...Show2MoreInfo_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show2MoreInfoFragmentContainer show={props.show} />
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
    expect(wrapper.root.findAllByType(Show2MoreInfo)).toHaveLength(1)
  })

  it("renders basic information", () => {
    const wrapper = getWrapper({
      Show: () => ({
        about: "Basic information about the show",
        pressRelease: "The press release for the show",
      }),
    })

    expect(wrapper.root.findAllByType(Show2MoreInfo)).toHaveLength(1)

    const text = extractText(wrapper.root)

    expect(text).toContain("Basic information about the show")
    expect(text).toContain("The press release for the show")
  })
})
