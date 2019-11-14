import { PartnerLocations_partner } from "__generated__/PartnerLocations_partner.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql, RelayPaginationProp } from "react-relay"
import { PartnerLocationsFixture } from "../__fixtures__/PartnerLocations-fixture"
import { PartnerLocationsContainer as PartnerLocations } from "../PartnerLocations"

jest.unmock("react-relay")

describe("PartnerLocations", () => {
  const getWrapper = async (partner: Omit<PartnerLocations_partner, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <PartnerLocations partner={{ ...partner }} relay={{ environment: {} } as RelayPaginationProp} {...props} />
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

  it("looks correct when rendered", async () => {
    const wrapper = await getWrapper(PartnerLocationsFixture as any)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
