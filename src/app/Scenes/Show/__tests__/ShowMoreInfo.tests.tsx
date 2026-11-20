import { act, screen } from "@testing-library/react-native"
import { ShowMoreInfoTestsQuery } from "__generated__/ShowMoreInfoTestsQuery.graphql"
import { ShowMoreInfoFragmentContainer } from "app/Scenes/Show/Screens/ShowMoreInfo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
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
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("renders without throwing an error", () => {
    getWrapper()
    expect(screen.getByText("About")).toBeOnTheScreen()
  })

  it("renders basic information", () => {
    getWrapper({
      Show: () => ({
        about: "Basic information about the show",
        pressRelease: "The press release for the show",
      }),
    })

    expect(screen.getByText("About")).toBeOnTheScreen()

    expect(screen.getByText(/Basic information about the show/)).toBeOnTheScreen()
    expect(screen.getByText(/The press release for the show/)).toBeOnTheScreen()
  })

  it("renders the partner type", () => {
    getWrapper({
      Partner: () => ({ type: "Institutional Seller" }),
    })

    expect(screen.getByText(/Institution/)).toBeOnTheScreen()
    expect(screen.queryByText(/Institutional Seller/)).not.toBeOnTheScreen()
  })

  it("renders the hours", () => {
    getWrapper()
    expect(screen.getByText("Hours")).toBeOnTheScreen()
  })

  it("does not render the hours if they are missing from the location", () => {
    getWrapper({ Location: () => ({ openingHours: null }) })
    expect(screen.queryByText("Hours")).not.toBeOnTheScreen()
  })

  it("renders the location", () => {
    getWrapper()
    expect(screen.getByText("Location")).toBeOnTheScreen()
  })

  it("does not render the location if the coordinates are missing", () => {
    getWrapper({ LatLng: () => ({ lat: null }) })
    expect(screen.queryByText("Location")).not.toBeOnTheScreen()
  })
})
