import { PartnerLocationsTestsQuery } from "__generated__/PartnerLocationsTestsQuery.graphql"
import { PartnerLocationsContainer as PartnerLocations } from "app/Scenes/Partner/Screens/PartnerLocations"
import { PartnerLocationsFixture } from "app/Scenes/Partner/Screens/__fixtures__/PartnerLocations-fixture"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("PartnerLocations", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<PartnerLocationsTestsQuery>
        variables={{}}
        environment={env}
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

    resolveMostRecentRelayOperation(env, {
      Partner: () => PartnerLocationsFixture,
    })

    expect(queryByText("Location")).toBeTruthy()
    expect(queryByText("Gagosian")).toBeTruthy()
  })
})
