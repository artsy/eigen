import { act, screen } from "@testing-library/react-native"
import { ShowLocationTestsQuery } from "__generated__/ShowLocationTestsQuery.graphql"
import { ShowLocationFragmentContainer } from "app/Scenes/Show/Components/ShowLocation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const COMPLETE_FAIR_LOCATION_FIXTURE = {
  city: "Greater London",
  address: "",
  address2: "",
  postalCode: "WC2R 1LT",
  summary: "Somerset House\r\nStrand\r\nLondon WC2R 1LA\r\nUnited Kingdom",
  coordinates: {
    lat: 51.5111618,
    lng: -0.1167937,
  },
}

const COMPLETE_PARTNER_LOCATION_FIXTURE = {
  city: "New York",
  address: "131 Allen Street",
  address2: "",
  postalCode: "10002",
  summary: null,
  coordinates: {
    lat: 40.720126,
    lng: -73.990347,
  },
}

describe("ShowLocation", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowLocationTestsQuery>
      environment={env}
      query={graphql`
        query ShowLocationTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowLocation_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowLocationFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = async (mockResolvers = {}) => {
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("renders the show location if there is a valid show location", async () => {
    await getWrapper({
      Show: () => ({ fair: null }),
      Partner: () => ({ name: "Example Partner Name" }),
      Location: () => COMPLETE_PARTNER_LOCATION_FIXTURE,
    })

    expect(screen.queryByText(/Example Partner Name at/)).not.toBeOnTheScreen()
    expect(screen.getByText(/Example Partner Name/)).toBeOnTheScreen()
    expect(screen.getByText(/131 Allen Street/)).toBeOnTheScreen()
    expect(screen.getByText(/New York, 10002/)).toBeOnTheScreen()
  })

  it("renders the fair location if there is a valid fair location", async () => {
    await getWrapper({
      Partner: () => ({ name: "Example Partner Name" }),
      Location: () => COMPLETE_FAIR_LOCATION_FIXTURE,
    })

    expect(screen.getByText(/Example Partner Name at/)).toBeOnTheScreen()
    expect(screen.getByText(/Somerset House/)).toBeOnTheScreen()
    expect(screen.getByText(/Strand/)).toBeOnTheScreen()
    expect(screen.getByText(/London WC2R 1LA/)).toBeOnTheScreen()
    expect(screen.getByText(/United Kingdom/)).toBeOnTheScreen()
  })
})
