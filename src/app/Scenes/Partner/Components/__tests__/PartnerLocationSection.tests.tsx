import { screen } from "@testing-library/react-native"
import { PartnerLocationSectionTestQuery } from "__generated__/PartnerLocationSectionTestQuery.graphql"
import { PartnerLocationSection_partner$data } from "__generated__/PartnerLocationSection_partner.graphql"
import {
  PartnerLocationSectionContainer,
  createLocationsString,
} from "app/Scenes/Partner/Components/PartnerLocationSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PartnerLoationSection", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerLocationSectionTestQuery>({
    Component: ({ partner }) => <PartnerLocationSectionContainer partner={partner!} />,
    query: graphql`
      query PartnerLocationSectionTestQuery($id: String!) @relay_test_operation {
        partner(id: $id) {
          ...PartnerLocationSection_partner
        }
      }
    `,
  })

  it("renders the locations text correctly", async () => {
    renderWithRelay({
      Partner: () => ({
        name: "Gagosian",
        locations: {
          totalCount: 14,
        },
        cities,
      }),
    })

    expect(screen.getByText(/Gagosian has 14 locations in/)).toBeTruthy()
    expect(
      screen.getByText(
        /New York, Beverly Hills, San Francisco, London, Paris, Le Bourget, Geneva, Basel, Rome, Athens/
      )
    ).toBeTruthy()
    expect(screen.getByText(/and/)).toBeTruthy()
    expect(screen.getByText(/Central, Hong Kong/)).toBeTruthy()

    expect(screen.getByText("See all location details")).toBeTruthy()
  })
})

describe("createLocationsString", () => {
  it("should return correct location string for single location", () => {
    const partner: PartnerLocationSection_partner$data = {
      name: "Test Partner",
      slug: "test-partner",
      locations: {
        totalCount: 1,
      },
      cities: ["New York"],
      " $fragmentType": "PartnerLocationSection_partner",
    }

    const result = createLocationsString(partner)

    expect(result).toEqual({
      locationText: "Test Partner has 1 location in",
      cityText: "New York",
    })
  })

  it("should return correct location string for multiple locations", () => {
    const partner: PartnerLocationSection_partner$data = {
      name: "Test Partner",
      slug: "test-partner",
      locations: {
        totalCount: 3,
      },
      cities: ["New York", "Los Angeles", "Chicago"],
      " $fragmentType": "PartnerLocationSection_partner",
    }

    const result = createLocationsString(partner)

    expect(result).toEqual({
      locationText: "Test Partner has 3 locations in",
      cityText: "New York, Los Angeles",
      lastCity: "Chicago",
    })
  })

  it("should return correct location string for multiple locations with one city", () => {
    const partner: PartnerLocationSection_partner$data = {
      name: "Test Partner",
      slug: "test-partner",
      locations: {
        totalCount: 3,
      },
      cities: ["New York"],
      " $fragmentType": "PartnerLocationSection_partner",
    }

    const result = createLocationsString(partner)

    expect(result).toEqual({
      locationText: "Test Partner has 3 locations in",
      cityText: "New York",
    })
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
