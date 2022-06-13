import { PartnerLocationSection_partner$data } from "__generated__/PartnerLocationSection_partner.graphql"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

jest.unmock("react-relay")

const PartnerLocationSectionFixture = {
  internalID: "4d8b92c44eb68a1b2c0004cb",
  name: "Gagosian",
  cities: [],
  locations: {
    totalCount: 14,
  },
  " $fragmentRefs": null,
  " $refType": null,
}

describe("PartnerLoationSection", () => {
  const getWrapper = async (partner: CleanRelayFragment<PartnerLocationSection_partner$data>) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <GlobalStoreProvider>
            <Theme>
              <PartnerLocationSection partner={{ ...partner }} {...props} />
            </Theme>
          </GlobalStoreProvider>
        )
      },
      query: graphql`
        query PartnerLocationSectionTestsQuery @raw_response_type {
          partner(id: "gagosian") {
            name
            cities
            locations: locationsConnection(first: 0) {
              totalCount
            }
          }
        }
      `,
      mockData: {
        partner,
      },
    })

  it("renders the locations text correctly", async () => {
    const partnerWithLocations = {
      ...PartnerLocationSectionFixture,
      cities,
    }
    const wrapper = await getWrapper(partnerWithLocations as any)
    expect(wrapper.text()).toContain(
      "Gagosian has 14 locations in New York, Beverly Hills, San Francisco, London, Paris, Le Bourget, Geneva, Basel, Rome, Athens and Central, Hong Kong"
    )
  })
})

const cities = [
  "New York",
  "Beverly Hills",
  "San Francisco",
  "London",
  "Paris",
  "Le Bourget",
  "Geneva",
  "Basel",
  "Rome",
  "Athens",
  "Central, Hong Kong",
]
