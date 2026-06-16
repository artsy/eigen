import { screen } from "@testing-library/react-native"
import { ConversationPartnerOfferUpdate } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferUpdate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ConversationPartnerOfferUpdate", () => {
  it("renders the offer message with the discounted price", () => {
    renderWithWrappers(
      <ConversationPartnerOfferUpdate
        event={{
          __typename: "PartnerOfferEvent",
          createdAt: "2026-06-15T12:00:00Z",
          amountDisplay: "US$450",
        }}
      />
    )

    expect(screen.getByText("You received an offer for US$450")).toBeTruthy()
  })

  it("falls back to a generic message when there is no discounted price", () => {
    renderWithWrappers(
      <ConversationPartnerOfferUpdate
        event={{
          __typename: "PartnerOfferEvent",
          createdAt: "2026-06-15T12:00:00Z",
          amountDisplay: null,
        }}
      />
    )

    expect(screen.getByText("You received an offer")).toBeTruthy()
  })
})
