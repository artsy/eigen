import { fireEvent, screen } from "@testing-library/react-native"
import { AlertBottomSheet } from "app/Scenes/SavedSearchAlertsList/Components/AlertBottomSheet"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("AlertBottomSheet", () => {
  const alert = {
    id: "123",
    title: "Banksy",
    artworksCount: 10,
  }

  it("renders correctly", () => {
    renderWithWrappers(<AlertBottomSheet alert={alert} onDismiss={jest.fn()} />)

    expect(screen.getByText("Banksy")).toBeTruthy()
    expect(screen.getByText("Edit Alert")).toBeTruthy()
    expect(screen.getByText(/View Artworks/)).toBeTruthy()
    expect(screen.getByText(/10/)).toBeTruthy()
  })

  it("edit alert button navigates to the edit screen", () => {
    renderWithWrappers(<AlertBottomSheet alert={alert} onDismiss={jest.fn()} />)

    fireEvent.press(screen.getByText("Edit Alert"))

    expect(navigate).toHaveBeenCalledWith("favorites/alerts/123/edit")
  })
})
