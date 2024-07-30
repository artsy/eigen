import { screen } from "@testing-library/react-native"
import { PartnerEntityHeaderTestsQuery } from "__generated__/PartnerEntityHeaderTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { PartnerEntityHeaderFragmentContainer } from "./PartnerEntityHeader"

describe("PartnerEntityHeader", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerEntityHeaderTestsQuery>({
    Component: (props) => <PartnerEntityHeaderFragmentContainer partner={props.partner!} />,
    query: graphql`
      query PartnerEntityHeaderTestsQuery($id: String!) @relay_test_operation {
        partner(id: $id) {
          ...PartnerEntityHeader_partner
        }
      }
    `,
  })

  it("renders correctly", () => {
    renderWithRelay({
      Partner: () => ({
        name: "Example Partner Name",
        cities: ["New York", "Berlin", "Tokyo", "Milan"],
      }),
    })

    expect(screen.getByText("Example Partner Name")).toBeOnTheScreen()
    expect(screen.getByText("New York, Berlin, +2 more")).toBeOnTheScreen()
    expect(screen.getByText("Follow")).toBeOnTheScreen()
  })
})
