import { fireEvent, screen } from "@testing-library/react-native"
import {
  PROVENANCE_LIST,
  SubmitArtworkPurchaseHistory,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkPurchaseHistory"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"

describe("SubmitArtworkPurchaseHistory", () => {
  it("shows and updates properly the purchase infromation", async () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkPurchaseHistory />,
    })

    const purchaseInformationSelect = screen.getByTestId("PurchaseInformation_Select")
    expect(purchaseInformationSelect).toBeOnTheScreen()

    fireEvent.press(purchaseInformationSelect)
    // Wait for the select modal to show up
    await flushPromiseQueue()

    fireEvent.press(screen.getByText(PROVENANCE_LIST[0].label))
    // Wait for the select modal to dismiss
    await flushPromiseQueue()
    expect(screen.getByText(PROVENANCE_LIST[0].label)).toBeOnTheScreen()
  })
})
