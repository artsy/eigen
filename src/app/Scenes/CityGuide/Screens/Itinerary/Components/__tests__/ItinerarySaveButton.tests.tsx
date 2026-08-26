import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySaveButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ItinerarySaveButton", () => {
  it("renders the add icon when not saved", () => {
    renderWithWrappers(<ItinerarySaveButton isSaved={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("itinerary-save-button-add-icon")).toBeTruthy()
    expect(screen.queryByTestId("itinerary-save-button-check-icon")).toBeNull()
  })

  it("renders the check icon when saved", () => {
    renderWithWrappers(<ItinerarySaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("itinerary-save-button-check-icon")).toBeTruthy()
    expect(screen.queryByTestId("itinerary-save-button-add-icon")).toBeNull()
  })

  it("calls onPress when tapped", () => {
    const onPress = jest.fn()
    renderWithWrappers(<ItinerarySaveButton isSaved={false} onPress={onPress} />)

    fireEvent.press(screen.getByTestId("itinerary-save-button"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not call onPress while saving", () => {
    const onPress = jest.fn()
    renderWithWrappers(<ItinerarySaveButton isSaved={false} onPress={onPress} isSaving />)

    fireEvent.press(screen.getByTestId("itinerary-save-button"))

    expect(onPress).not.toHaveBeenCalled()
  })

  it("exposes its saved state for accessibility", () => {
    renderWithWrappers(<ItinerarySaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("itinerary-save-button").props.accessibilityState.selected).toBe(true)
  })
})
