import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import { graphql } from "react-relay"
import { PurchaseModalFragmentContainer } from "./PurchaseModal"

jest.unmock("react-relay")

describe("PurchaseModal", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props) => (
      <Theme>
        <GlobalStoreProvider>
          <PurchaseModalFragmentContainer artwork={props.artwork} conversationID="1234" />
        </GlobalStoreProvider>
      </Theme>
    ),
    query: graphql`
      query PurchaseModalTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...PurchaseModal_artwork
        }
      }
    `,
  })

  it("renders edition sets radio buttons", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })

    const { getByText } = renderWithRelay({
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

    expect(getByText("Confirm")).toBeDisabled()
    expect(getByText("Cancel")).toBeEnabled()
  })

  it("doesn't allow edition set selection when it's not isAcquireable", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })

    const { getByText } = renderWithRelay({
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

    expect(getByText("Confirm")).toBeDisabled()
    fireEvent.press(getByText("in1 x in1 x in1"))
    expect(getByText("Confirm")).toBeDisabled()
  })

  it("enables confirm button when an edition set is selected", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })

    const { getByText } = renderWithRelay({
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

    expect(getByText("Confirm")).toBeDisabled()
    fireEvent.press(getByText("in1 x in1 x in1"))
    expect(getByText("Confirm")).toBeEnabled()
  })
})
