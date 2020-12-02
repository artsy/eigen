import { Show2LocationTestsQuery } from "__generated__/Show2LocationTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Show2LocationFragmentContainer } from "../Components/Show2Location"

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

jest.unmock("react-relay")

describe("Show2Location", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Show2LocationTestsQuery>
      environment={env}
      query={graphql`
        query Show2LocationTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...Show2Location_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show2LocationFragmentContainer show={props.show} />
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

  it("renders the show location if there is a valid show location", () => {
    const wrapper = getWrapper({
      Show: () => ({ fair: null }),
      Partner: () => ({ name: "Example Partner Name" }),
      Location: () => COMPLETE_PARTNER_LOCATION_FIXTURE,
    })

    const text = extractText(wrapper.root)

    expect(text).not.toContain("Example Partner Name at")
    expect(text).toContain("Example Partner Name")
    expect(text).toContain("131 Allen Street")
    expect(text).toContain("New York, 10002")
  })

  it("renders the fair location if there is a valid fair location", () => {
    const wrapper = getWrapper({
      Partner: () => ({ name: "Example Partner Name" }),
      Location: () => COMPLETE_FAIR_LOCATION_FIXTURE,
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Example Partner Name at")
    expect(text).toContain("Somerset House")
    expect(text).toContain("Strand")
    expect(text).toContain("London WC2R 1LA")
    expect(text).toContain("United Kingdom")
  })
})
