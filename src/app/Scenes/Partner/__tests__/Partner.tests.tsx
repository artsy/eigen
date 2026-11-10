import { screen } from "@testing-library/react-native"
import { PartnerTestsQuery } from "__generated__/PartnerTestsQuery.graphql"
import { PartnerContainer } from "app/Scenes/Partner/Partner"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Partner", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerTestsQuery>({
    Component: ({ partner }) => <PartnerContainer partner={partner!} />,
    query: graphql`
      query PartnerTestsQuery @relay_test_operation {
        partner(id: "a-gallery") {
          ...Partner_partner
        }
      }
    `,
  })

  it("puts a share button in the header of a full partner page", () => {
    renderWithRelay({
      Partner: () => ({ name: "A Gallery", slug: "a-gallery", displayFullPartnerPage: true }),
    })

    expect(screen.getByLabelText("Share Partner")).toBeOnTheScreen()
  })

  it("puts a share button in the header of a limited partner page", () => {
    renderWithRelay({
      Partner: () => ({
        name: "A Gallery",
        slug: "a-gallery",
        displayFullPartnerPage: false,
        partnerType: "Gallery",
      }),
    })

    expect(screen.getByLabelText("Share Partner")).toBeOnTheScreen()
  })
})
