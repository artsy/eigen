import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionBannerEmptyState } from "app/Scenes/MyProfile/Components/UserAccountHeader/MyCollectionBannerEmptyState"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionBannerEmptyState", () => {
  it("renders the component", async () => {
    await renderWithWrappers(<MyCollectionBannerEmptyState />)
    expect(screen.getByText("Build Your Collection")).toBeTruthy()
  })

  it("navigates to my-collection when pressed", async () => {
    await renderWithWrappers(<MyCollectionBannerEmptyState />)
    await fireEvent.press(screen.getByTestId("my-collection-banner-empty-state"))
    expect(navigate).toHaveBeenCalledWith("my-collection")
  })
})
