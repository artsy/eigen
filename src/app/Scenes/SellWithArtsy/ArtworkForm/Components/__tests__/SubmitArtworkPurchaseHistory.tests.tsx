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

    fireEvent.press(screen.getByText("Purchase information"))

    // wait for modal to open
    await screen.findByText(PROVENANCE_LIST[0].label)

    // check if all options are visible
    expect(screen.getByText(PROVENANCE_LIST[1].label)).toBeOnTheScreen()
    expect(screen.getByText(PROVENANCE_LIST[2].label)).toBeOnTheScreen()
    expect(screen.getByText(PROVENANCE_LIST[3].label)).toBeOnTheScreen()
    expect(screen.getByText(PROVENANCE_LIST[4].label)).toBeOnTheScreen()
    expect(screen.getByText(PROVENANCE_LIST[5].label)).toBeOnTheScreen()
  })
})
