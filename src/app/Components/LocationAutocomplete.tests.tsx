import { fireEvent } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { buildLocationDisplay, LocationAutocomplete } from "./LocationAutocomplete"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const mockOnChange = jest.fn()

describe("LocationAutocomplete", () => {
  it("pre-fills the input with the initialLocation", () => {
    const { getByTestId } = renderWithWrappersTL(
      <LocationAutocomplete initialLocation={initialLocation} onChange={mockOnChange} />
    )

    expect(getByTestId("autocomplete-location-input").props.value).toBe("Berlin, Germany")
  })

  it("pre-fills the input with the displayLocation", () => {
    const { getByTestId } = renderWithWrappersTL(
      <LocationAutocomplete
        displayLocation={buildLocationDisplay(initialLocation)}
        onChange={mockOnChange}
      />
    )

    expect(getByTestId("autocomplete-location-input").props.value).toBe("Berlin, Berlin, Germany")
  })

  describe("when selecting a location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
      ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
    })

    it("queries google when the user types 3 or more characters", async () => {
      const { getByTestId, getByText } = renderWithWrappersTL(
        <LocationAutocomplete onChange={mockOnChange} />
      )

      const input = getByTestId("autocomplete-location-input")

      fireEvent(input, "focus")

      fireEvent(input, "changeText", "f")
      expect(getLocationPredictions).not.toHaveBeenCalled()

      fireEvent(input, "changeText", "fo")
      expect(getLocationPredictions).not.toHaveBeenCalled()

      fireEvent(input, "changeText", "foo")
      expect(getLocationPredictions).toHaveBeenCalled()

      await flushPromiseQueue()

      expect(getByTestId("autocomplete-location-predictions").children.length).not.toEqual(0)

      expect(getByText("Busytown, USA")).toBeTruthy()
      expect(getByText("Hello, USA")).toBeTruthy()
    })

    it("calls the onChange with the correct location and clears the predictions when the user selects a location", async () => {
      const { getByTestId } = renderWithWrappersTL(<LocationAutocomplete onChange={mockOnChange} />)

      const input = getByTestId("autocomplete-location-input")

      fireEvent(input, "focus")
      fireEvent(input, "changeText", "foo")

      expect(getLocationPredictions).toHaveBeenCalled()

      await flushPromiseQueue()

      const result = getByTestId("autocomplete-location-prediction-a")

      fireEvent.press(result)

      expect(getLocationDetails).toHaveBeenCalled()

      await flushPromiseQueue()

      expect(mockOnChange).toHaveBeenCalledWith(locationDetails)
    })
  })
})
