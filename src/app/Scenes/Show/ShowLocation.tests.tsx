import { ShowLocationTestsQuery } from "__generated__/ShowLocationTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

import { ShowLocationFragmentContainer } from "./Components/ShowLocation"

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
  const TestRenderer = () => (
    <QueryRenderer<ShowLocationTestsQuery>
      environment={getRelayEnvironment()}
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

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
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
