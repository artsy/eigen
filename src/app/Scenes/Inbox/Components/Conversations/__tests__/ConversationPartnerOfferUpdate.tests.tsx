import { screen } from "@testing-library/react-native"
import { ConversationPartnerOfferUpdateTestQuery } from "__generated__/ConversationPartnerOfferUpdateTestQuery.graphql"
import { ConversationPartnerOfferUpdate } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferUpdate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

let isPurchased = false

const { renderWithRelay } = setupTestWrapper<ConversationPartnerOfferUpdateTestQuery>({
  Component: ({ artwork }) => (
    <ConversationPartnerOfferUpdate
      partnerOffer={{ ...artwork!.collectorSignals!.partnerOffer!, isPurchased }}
    />
  ),
  query: graphql`
    query ConversationPartnerOfferUpdateTestQuery @relay_test_operation {
      artwork(id: "artwork-id") {
        collectorSignals {
          partnerOffer {
            ...ConversationPartnerOfferUpdate_partnerOffer
          }
        }
      }
    }
  `,
})

describe("ConversationPartnerOfferUpdate", () => {
  beforeEach(() => {
    isPurchased = false
  })

  it("renders the offer message with the discounted price", () => {
    renderWithRelay({
      PartnerOfferToCollector: () => ({
        createdAt: "2026-06-15T12:00:00Z",
        priceWithDiscount: { display: "US$450" },
      }),
    })

    expect(screen.getByText("You received an offer for US$450")).toBeTruthy()
  })

  it("falls back to a generic message when there is no discounted price", () => {
    renderWithRelay({
      PartnerOfferToCollector: () => ({
        createdAt: "2026-06-15T12:00:00Z",
        priceWithDiscount: null,
      }),
    })

    expect(screen.getByText("You received an offer")).toBeTruthy()
  })

  it("renders a purchase confirmation when the offer was fulfilled", () => {
    isPurchased = true

    renderWithRelay({
      PartnerOfferToCollector: () => ({
        createdAt: "2026-06-15T12:00:00Z",
        priceWithDiscount: { display: "US$450" },
      }),
    })

    expect(screen.getByText("You purchased this artwork")).toBeTruthy()
    expect(screen.queryByText("You received an offer for US$450")).toBeNull()
  })
})
