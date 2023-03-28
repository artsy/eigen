import { fireEvent } from "@testing-library/react-native"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { buildLocationDisplay, LocationAutocomplete } from "./LocationAutocomplete"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const mockOnChange = jest.fn()

describe("LocationAutocomplete", () => {
  it("pre-fills the input with the initialLocation", () => {
    const { getByTestId } = renderWithWrappers(
      <LocationAutocomplete initialLocation={initialLocation} onChange={mockOnChange} />
    )

    expect(getByTestId("autocomplete-location-input").props.value).toBe("Berlin, Germany")
  })

  it("pre-fills the input with the displayLocation", () => {
    const { getByTestId } = renderWithWrappers(
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
      const { getByTestId, getByText } = renderWithWrappers(
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
      const { getByTestId } = renderWithWrappers(<LocationAutocomplete onChange={mockOnChange} />)

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

  describe("when typing a custom location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
      ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
    })

    it("calls onChange with a custom location", async () => {
      const { getByTestId } = renderWithWrappers(
        <LocationAutocomplete allowCustomLocation onChange={mockOnChange} />
      )

      const input = getByTestId("autocomplete-location-input")

      fireEvent(input, "focus")
      fireEvent(input, "changeText", "A custom location")

      fireEvent(input, "blur")

      await flushPromiseQueue()

      expect(mockOnChange).toHaveBeenCalledWith({ city: "A custom location" })
    })
  })

  describe("when there are no results", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue([])
    })

    it("shows a message", async () => {
      const { getByText, getByTestId } = renderWithWrappers(
        <LocationAutocomplete showError onChange={mockOnChange} />
      )

      expect(() => getByText("Please try searching again with a different spelling.")).toThrow(
        "Unable to find an element with text: Please try searching again with a different spelling."
      )

      const input = getByTestId("autocomplete-location-input")
      fireEvent.changeText(input, "there is no such a location")

      await flushPromiseQueue()

      expect(getByText("Please try searching again with a different spelling.")).toBeTruthy()
    })
  })
})

const locationPredictions = [
  { id: "a", name: "Busytown, USA" },
  { id: "b", name: "Hello, USA" },
]

const locationDetails = {
  city: "Busytown",
  coordinates: [1, 2],
  country: "USA",
  postalCode: "12345",
  state: "CA",
  stateCode: "CA",
}

const initialLocation = {
  id: "x",
  name: "Berlin, Germany",
  city: "Berlin",
  country: "Germany",
  postalCode: "12345",
  state: "Berlin",
  stateCode: "BE",
}
