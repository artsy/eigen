import { fireEvent, screen } from "@testing-library/react-native"
import { PurchaseModalTestQuery } from "__generated__/PurchaseModalTestQuery.graphql"
import { PurchaseModalFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/PurchaseModal"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PurchaseModal", () => {
  const { renderWithRelay } = setupTestWrapper<PurchaseModalTestQuery>({
    Component: ({ artwork }) => (
      <PurchaseModalFragmentContainer artwork={artwork!} conversationID="1234" />
    ),
    query: graphql`
      query PurchaseModalTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...PurchaseModal_artwork
        }
      }
    `,
  })

  it("renders edition sets radio buttons", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "test-id",
        isEdition: true,
        editionSets: [
          {
            internalID: "first-edition-set",
            dimensions: {
              cm: "cm1 x cm1 x cm1",
              in: "in1 x in1 x in1",
            },
          },
          {
            internalID: "second-edition-set",
            dimensions: {
              cm: "cm2 x cm2 x cm2",
              in: "in2 x in2 x in2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Confirm")).toBeDisabled()
    expect(screen.getByText("Cancel")).toBeEnabled()
  })

  it("doesn't allow edition set selection when it's not isAcquireable", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "test-id",
        isEdition: true,
        editionSets: [
          {
            internalID: "first-edition-set",
            dimensions: {
              cm: "cm1 x cm1 x cm1",
              in: "in1 x in1 x in1",
            },
          },
          {
            internalID: "second-edition-set",
            dimensions: {
              cm: "cm2 x cm2 x cm2",
              in: "in2 x in2 x in2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Confirm")).toBeDisabled()
    await fireEvent.press(screen.getByText("in1 x in1 x in1"))
    expect(screen.getByText("Confirm")).toBeDisabled()
  })

  it("enables confirm button when an edition set is selected", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "test-id",
        isEdition: true,
        editionSets: [
          {
            isAcquireable: true,
            internalID: "first-edition-set",
            dimensions: {
              cm: "cm1 x cm1 x cm1",
              in: "in1 x in1 x in1",
            },
          },
          {
            isAcquireable: true,
            internalID: "second-edition-set",
            dimensions: {
              cm: "cm2 x cm2 x cm2",
              in: "in2 x in2 x in2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Confirm")).toBeDisabled()
    await fireEvent.press(screen.getByText("in1 x in1 x in1"))
    expect(screen.getByText("Confirm")).toBeEnabled()
  })
})
