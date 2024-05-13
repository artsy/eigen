import { screen } from "@testing-library/react-native"
import { NotificationCommercialButtons_Test_Query } from "__generated__/NotificationCommercialButtons_Test_Query.graphql"
import { CommercialButtons } from "app/Scenes/Activity/components/NotificationCommercialButtons"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CommercialButtons", () => {
  const { renderWithRelay } = setupTestWrapper<NotificationCommercialButtons_Test_Query>({
    Component: (props) => <CommercialButtons {...(props as any)} />,
    query: graphql`
      query NotificationCommercialButtons_Test_Query @relay_test_operation {
        artwork(id: "artworkID") {
          ...NotificationCommercialButtons_artwork
        }
      }
    `,
  })

  describe("when partner offer is expired", () => {
    it("renders View Work when the feature flag is on", () => {
      renderWithRelay(
        { Artwork: () => ({ internalID: "artwork-id" }) },
        { artworkID: "artwork-id", partnerOffer }
      )

      expect(screen.getByText("View Work")).toBeTruthy()
    })
  })
})

const partnerOffer = {
  id: "partnerOfferID",
  internalID: "partnerOfferID",
  isAvailable: true,
  endAt: "2022-01-01T00:00:00Z",
  targetHref: "https://www.artsy.net",
}
