import { screen } from "@testing-library/react-native"
import { PartnerTestsQuery } from "__generated__/PartnerTestsQuery.graphql"
import { PartnerContainer } from "app/Scenes/Partner/Partner"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
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

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableShareShowPartnerFeature: true })
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

  it("hides the share button when sharing is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableShareShowPartnerFeature: false })

    renderWithRelay({ Partner: () => ({ displayFullPartnerPage: true }) })

    expect(screen.queryByLabelText("Share Partner")).not.toBeOnTheScreen()
  })
})
