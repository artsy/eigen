import { fireEvent, screen } from "@testing-library/react-native"
import {
  PROVENANCE_LIST,
  SubmitArtworkPurchaseHistory,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkPurchaseHistory"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkPurchaseHistory", () => {
  it("shows and updates properly the purchase infromation", async () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkPurchaseHistory />,
    })

    const purchaseInformationSelect = screen.getByTestId("PurchaseInformation_Select")
    expect(purchaseInformationSelect).toBeOnTheScreen()

    fireEvent.press(purchaseInformationSelect)

    fireEvent.press(screen.getByText(PROVENANCE_LIST[0].label))
    expect(screen.getAllByText(PROVENANCE_LIST[0].label)).toHaveLength(1)
  })
})
