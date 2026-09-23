import { ShowHeaderTestsQuery } from "__generated__/ShowHeaderTestsQuery.graphql"
import { ShowHeaderFragmentContainer } from "app/Scenes/Show/Components/ShowHeader"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ShowHeader", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowHeaderTestsQuery>
      environment={env}
      query={graphql`
        query ShowHeaderTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowHeader_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowHeaderFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return view
  }

  it("renders a 'Show' eyebrow above the title", () => {
    const wrapper = getWrapper({
      Show: () => ({ name: "Splash: Sea, Beach, and Pool" }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Show")
    expect(text).toContain("Splash: Sea, Beach, and Pool")
  })
})
