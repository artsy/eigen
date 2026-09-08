import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideSaveButton } from "app/Scenes/CityGuide/Components/CityGuideSaveButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideSaveButton", () => {
  it("renders the add icon when not saved", () => {
    renderWithWrappers(<CityGuideSaveButton isSaved={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("city-guide-save-button-add-icon")).toBeTruthy()
    expect(screen.queryByTestId("city-guide-save-button-check-icon")).toBeNull()
  })

  it("renders the check icon when saved", () => {
    renderWithWrappers(<CityGuideSaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("city-guide-save-button-check-icon")).toBeTruthy()
    expect(screen.queryByTestId("city-guide-save-button-add-icon")).toBeNull()
  })

  it("calls onPress when tapped", () => {
    const onPress = jest.fn()
    renderWithWrappers(<CityGuideSaveButton isSaved={false} onPress={onPress} />)

    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not call onPress while saving", () => {
    const onPress = jest.fn()
    renderWithWrappers(<CityGuideSaveButton isSaved={false} onPress={onPress} isSaving />)

    fireEvent.press(screen.getByTestId("city-guide-save-button"))

    expect(onPress).not.toHaveBeenCalled()
  })

  it("exposes its saved state for accessibility", () => {
    renderWithWrappers(<CityGuideSaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("city-guide-save-button").props.accessibilityState.selected).toBe(
      true
    )
  })
})
