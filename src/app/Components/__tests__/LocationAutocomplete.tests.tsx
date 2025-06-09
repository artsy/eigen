import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { buildLocationDisplay, LocationAutocomplete } from "app/Components/LocationAutocomplete"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

const mockOnChange = jest.fn()

describe("LocationAutocomplete", () => {
  it("pre-fills the input with the initialLocation", () => {
    renderWithWrappers(
      <LocationAutocomplete initialLocation={initialLocation} onChange={mockOnChange} />
    )

    expect(screen.getByTestId("autocomplete-location-input").props.value).toBe("Berlin, Germany")
  })

  it("pre-fills the input with the displayLocation", () => {
    renderWithWrappers(
      <LocationAutocomplete
        displayLocation={buildLocationDisplay(initialLocation)}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByTestId("autocomplete-location-input").props.value).toBe(
      "Berlin, Berlin, Germany"
    )
  })

  describe("when selecting a location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
      ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
    })

    it("queries google when the user types 3 or more characters", async () => {
      renderWithWrappers(<LocationAutocomplete onChange={mockOnChange} />)

      const input = screen.getByTestId("autocomplete-location-input")

      fireEvent(input, "focus")

      fireEvent(input, "changeText", "f")
      expect(getLocationPredictions).not.toHaveBeenCalled()

      fireEvent(input, "changeText", "fo")
      expect(getLocationPredictions).not.toHaveBeenCalled()

      fireEvent(input, "changeText", "foo")
      expect(getLocationPredictions).toHaveBeenCalled()

      await waitFor(() =>
        // TOFIX: fix children direct access
        // eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByTestId("autocomplete-location-predictions").children.length).not.toEqual(
          0
        )
      )

      expect(screen.getByText("Busytown, USA")).toBeTruthy()
      expect(screen.getByText("Hello, USA")).toBeTruthy()
    })

    it("calls the onChange with the correct location and clears the predictions when the user selects a location", async () => {
      renderWithWrappers(<LocationAutocomplete onChange={mockOnChange} />)

      const input = screen.getByTestId("autocomplete-location-input")

      fireEvent(input, "focus")
      fireEvent(input, "changeText", "foo")

      expect(getLocationPredictions).toHaveBeenCalled()

      const result = await screen.findByTestId("autocomplete-location-prediction-a")
      fireEvent.press(result)

      expect(getLocationDetails).toHaveBeenCalled()

      await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(locationDetails))
    })
  })

  describe("when typing a custom location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
      ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
    })

    it("calls onChange with a custom location", async () => {
      renderWithWrappers(<LocationAutocomplete allowCustomLocation onChange={mockOnChange} />)

      const input = screen.getByTestId("autocomplete-location-input")

      fireEvent(input, "focus")
      fireEvent(input, "changeText", "A custom location")

      fireEvent(input, "blur")

      await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith({ city: "A custom location" }))
    })
  })

  describe("when there are no results", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue([])
    })

    it("shows a message", async () => {
      renderWithWrappers(<LocationAutocomplete showError onChange={mockOnChange} />)

      expect(() =>
        screen.getByText("Please try searching again with a different spelling.")
      ).toThrow(
        "Unable to find an element with text: Please try searching again with a different spelling."
      )

      const input = screen.getByTestId("autocomplete-location-input")
      fireEvent.changeText(input, "there is no such a location")

      await (() =>
        expect(
          screen.getByText("Please try searching again with a different spelling.")
        ).toBeTruthy())
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
