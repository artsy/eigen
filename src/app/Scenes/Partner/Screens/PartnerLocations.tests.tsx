import { PartnerLocationsTestsQuery } from "__generated__/PartnerLocationsTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { graphql, QueryRenderer } from "react-relay"
import { PartnerLocationsFixture } from "./__fixtures__/PartnerLocations-fixture"
import { PartnerLocationsContainer as PartnerLocations } from "./PartnerLocations"

describe("PartnerLocations", () => {
  const TestRenderer = () => {
    return (
      <QueryRenderer<PartnerLocationsTestsQuery>
        variables={{ partnerID: "gagosian" }}
        environment={getRelayEnvironment()}
        query={graphql`
          query PartnerLocationsTestsQuery @raw_response_type {
            partner(id: "gagosian") {
              id
              name
              internalID
              locations: locationsConnection(first: 10) {
                edges {
                  node {
                    id
                    ...PartnerMap_location
                  }
                }
              }
            }
          }
        `}
        render={renderWithLoadProgress(PartnerLocations)}
      />
    )
  }

  it("renders without throwing an error", async () => {
    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Partner: () => PartnerLocationsFixture,
    })

    expect(queryByText("Location")).toBeTruthy()
    expect(queryByText("Gagosian")).toBeTruthy()
  })
})
