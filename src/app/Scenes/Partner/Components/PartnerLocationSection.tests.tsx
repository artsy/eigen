import { PartnerLocationSectionTestQuery } from "__generated__/PartnerLocationSectionTestQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { PartnerLocationSectionContainer } from "./PartnerLocationSection"

jest.unmock("react-relay")

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
    const { queryByText } = renderWithRelay({
      Partner: () => ({
        name: "Gagosian",
        locations: {
          totalCount: 14,
        },
        cities,
      }),
    })

    expect(queryByText(/Gagosian has 14 locations in/)).toBeTruthy()
    expect(
      queryByText(
        /New York, Beverly Hills, San Francisco, London, Paris, Le Bourget, Geneva, Basel, Rome, Athens/
      )
    ).toBeTruthy()
    expect(queryByText(/and/)).toBeTruthy()
    expect(queryByText(/Central, Hong Kong/)).toBeTruthy()

    expect(queryByText("See all location details")).toBeTruthy()
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
