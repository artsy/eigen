import { ShowHoursTestsQuery } from "__generated__/ShowHoursTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

import { ShowHoursFragmentContainer } from "./Components/ShowHours"

describe("ShowHours", () => {
  const TestRenderer = () => (
    <QueryRenderer<ShowHoursTestsQuery>
      environment={getRelayEnvironment()}
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  it("renders nothing if there is no show location or fair location", () => {
    const wrapper = getWrapper({
      Show: () => ({ location: null, fair: null }),
    })

    expect(wrapper.toJSON()).toBe(null)
  })

  it("renders the custom fair location if there is a fair", () => {
    const wrapper = getWrapper({
      Location: () => ({ openingHours: { __typename: "OpeningHoursText" } }),
      OpeningHoursText: () => ({ text: "Custom schedule text" }),
    })

    expect(extractText(wrapper.root)).toEqual("Custom schedule text")
  })

  it("renders the show location schedules if there is no fair", () => {
    const wrapper = getWrapper({
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

    const text = extractText(wrapper.root)

    expect(text).toContain("Monday–Wednesday, Sunday, Closed")
    expect(text).toContain("Thursday–Saturday, 11am–4pm")
  })
})
