import { screen } from "@testing-library/react-native"
import { PartnerOverview_Test_Query } from "__generated__/PartnerOverview_Test_Query.graphql"
import { PartnerOverviewFragmentContainer } from "app/Scenes/Partner/Components/PartnerOverview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PartnerOverview", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerOverview_Test_Query>({
    Component: (props: any) => <PartnerOverviewFragmentContainer {...props} />,
    query: graphql`
      query PartnerOverview_Test_Query @relay_test_operation {
        partner(id: "example") {
          ...PartnerOverview_partner
        }
      }
    `,
  })

  it("renders the about text", async () => {
    renderWithRelay({
      Partner: () => ({
        profile: {
          bio: "About the gallery",
        },
        cities: ["New York"],
        name: "Example Gallery",
        artistsConnection: {
          totalCount: 100,
        },
      }),
    })

    expect(screen.getByText("About the gallery")).toBeOnTheScreen()
  })
})
