import { PartnerLocations_partner$data } from "__generated__/PartnerLocations_partner.graphql"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import React from "react"
import { graphql, RelayPaginationProp } from "react-relay"
import { PartnerLocationsFixture } from "./__fixtures__/PartnerLocations-fixture"
import { PartnerLocationsContainer as PartnerLocations } from "./PartnerLocations"

jest.unmock("react-relay")

describe("PartnerLocations", () => {
  const getWrapper = async (partner: CleanRelayFragment<PartnerLocations_partner$data>) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <PartnerLocations
            partner={{ ...partner }}
            relay={{ environment: {} } as RelayPaginationProp}
            {...props}
          />
        )
      },
      query: graphql`
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
      `,
      mockData: {
        partner,
      },
    })

  it("renders without throwing an error", async () => {
    await getWrapper(PartnerLocationsFixture as any)
  })
})
