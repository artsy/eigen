jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

import { fireEvent } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import React from "react"
import { DetailedLocationAutocomplete } from "./DetailedLocationAutocomplete"

const mockOnChange = jest.fn()

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

describe("LocationAutocomplete", () => {
  it("pre-fills the input with the initialLocation", () => {
    const { getByTestId } = renderWithWrappersTL(
      <DetailedLocationAutocomplete initialLocation="Anytown, USA" onChange={mockOnChange} />
    )

    expect(getByTestId("detailed-location-autocomplete-input").props.value).toEqual("Anytown, USA")
  })

  describe("when selecting a location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
      ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
    })

    it("calls onChange with correct location", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <DetailedLocationAutocomplete initialLocation="Anytown, USA" onChange={mockOnChange} />
      )

      const input = getByTestId("detailed-location-autocomplete-input")

      fireEvent(input, "focus")
      fireEvent(input, "changeText", "foo")

      await flushPromiseQueue()

      expect(getLocationPredictions).toHaveBeenCalled()

      const result = getByTestId("detailed-location-autocomplete-result-a")

      fireEvent.press(result)

      await flushPromiseQueue()

      expect(getLocationDetails).toHaveBeenCalled()

      expect(mockOnChange).toHaveBeenCalledWith(locationDetails)
    })
  })

  describe("when typing a location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationPredictions)
      ;(getLocationDetails as jest.Mock).mockResolvedValue(locationDetails)
    })

    it("calls onChange with correct location", async () => {
      const { getByTestId } = renderWithWrappersTL(
        <DetailedLocationAutocomplete initialLocation="Anytown, USA" onChange={mockOnChange} />
      )

      const input = getByTestId("detailed-location-autocomplete-input")

      fireEvent(input, "focus")
      fireEvent(input, "changeText", "A custom location")

      fireEvent(input, "blur")

      await flushPromiseQueue()

      expect(mockOnChange).toHaveBeenCalledWith({ city: "A custom location" })
    })
  })
})
