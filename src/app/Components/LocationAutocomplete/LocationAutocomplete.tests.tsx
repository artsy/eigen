import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { LocationAutocomplete } from "./LocationAutocomplete"

jest.unmock("react-relay")
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

const mockOnChange = jest.fn()
const emptyInitialLocation = {
  city: "",
  state: "",
  country: "",
  countryCode: "",
}

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <LocationAutocomplete initialLocation={emptyInitialLocation} onChange={mockOnChange} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  describe("LocationAutocomplete", () => {
    it("renders input correctly with correct placeholder", () => {
      const { getByTestId, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
      expect(getByTestId("Submission_LocationInput")).toBeTruthy()
      expect(getByPlaceholderText("Enter City Where Artwork Is Located")).toBeTruthy()
    })

    it("has input's value empty initially", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      const locationInput = getByTestId("Submission_LocationInput")
      expect(locationInput.props.value).toBe("")
    })

    it("mutates the typed value", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      const locationInput = getByTestId("Submission_LocationInput")

      fireEvent.changeText(locationInput, "berlin")
      expect(locationInput.props.value).toBe("berlin")
    })

    it("displays a message when no location is found", async () => {
      const { getByText, getByTestId } = renderWithWrappersTL(<TestRenderer />)

      const locationInput = getByTestId("Submission_LocationInput")
      fireEvent.changeText(locationInput, "there is no such a location")

      await flushPromiseQueue()

      const locationNotFoundMessage = getByText(
        "Please try searching again with a different spelling."
      )
      expect(locationNotFoundMessage).toBeTruthy()
    })
  })
})
