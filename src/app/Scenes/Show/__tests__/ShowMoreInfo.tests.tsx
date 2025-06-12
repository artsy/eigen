import { ShowMoreInfoTestsQuery } from "__generated__/ShowMoreInfoTestsQuery.graphql"
import { ShowHoursFragmentContainer } from "app/Scenes/Show/Components/ShowHours"
import { ShowLocationFragmentContainer } from "app/Scenes/Show/Components/ShowLocation"
import { ShowMoreInfo, ShowMoreInfoFragmentContainer } from "app/Scenes/Show/Screens/ShowMoreInfo"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ShowMoreInfo", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowMoreInfoTestsQuery>
      environment={env}
      query={graphql`
        query ShowMoreInfoTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowMoreInfo_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowMoreInfoFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ShowMoreInfo)).toHaveLength(1)
  })

  it("renders basic information", () => {
    const wrapper = getWrapper({
      Show: () => ({
        about: "Basic information about the show",
        pressRelease: "The press release for the show",
      }),
    })

    expect(wrapper.root.findAllByType(ShowMoreInfo)).toHaveLength(1)

    const text = extractText(wrapper.root)

    expect(text).toContain("Basic information about the show")
    expect(text).toContain("The press release for the show")
  })

  it("renders the partner type", () => {
    const wrapper = getWrapper({
      Partner: () => ({ type: "Institutional Seller" }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Institution")
    expect(text).not.toContain("Institutional Seller")
  })

  it("renders the hours", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ShowHoursFragmentContainer)).toHaveLength(1)
  })

  it("does not render the hours if they are missing from the location", () => {
    const wrapper = getWrapper({ Location: () => ({ openingHours: null }) })
    expect(wrapper.root.findAllByType(ShowHoursFragmentContainer)).toHaveLength(0)
  })

  it("renders the location", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ShowLocationFragmentContainer)).toHaveLength(1)
  })

  it("does not render the location if the coordinates are missing", () => {
    const wrapper = getWrapper({ LatLng: () => ({ lat: null }) })
    expect(wrapper.root.findAllByType(ShowLocationFragmentContainer)).toHaveLength(0)
  })
})
