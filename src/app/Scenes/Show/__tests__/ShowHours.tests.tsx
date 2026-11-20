import { act, screen } from "@testing-library/react-native"
import { ShowHoursTestsQuery } from "__generated__/ShowHoursTestsQuery.graphql"
import { ShowHoursFragmentContainer } from "app/Scenes/Show/Components/ShowHours"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ShowHours", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowHoursTestsQuery>
      environment={env}
      query={graphql`
        query ShowHoursTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowHours_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowHoursFragmentContainer show={props.show} />
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

  it("renders nothing if there is no show location or fair location", () => {
    getWrapper({
      Show: () => ({ location: null, fair: null }),
    })

    expect(screen.queryAllByText(/.+/)).toHaveLength(0)
  })

  it("renders the custom fair location if there is a fair", () => {
    getWrapper({
      Location: () => ({ openingHours: { __typename: "OpeningHoursText" } }),
      OpeningHoursText: () => ({ text: "Custom schedule text" }),
    })

    expect(screen.getByText("Custom schedule text")).toBeOnTheScreen()
  })

  it("renders the show location schedules if there is no fair", () => {
    getWrapper({
      Show: () => ({ fair: null }),
      OpeningHoursArray: () => ({
        schedules: [
          {
            days: "Monday–Wednesday, Sunday",
            hours: "Closed",
          },
          {
            days: "Thursday–Saturday",
            hours: "11am–4pm",
          },
        ],
      }),
    })

    expect(screen.getByText("Monday–Wednesday, Sunday, Closed")).toBeOnTheScreen()
    expect(screen.getByText("Thursday–Saturday, 11am–4pm")).toBeOnTheScreen()
  })
})
