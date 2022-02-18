import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { LocationAutocomplete } from "./LocationAutocomplete"

jest.unmock("react-relay")
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

const mockOnChange = jest.fn()
const emptyInitialLocation = {
  city: "",
  state: "",
  country: "",
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

      act(() => fireEvent.changeText(locationInput, "berlin"))
      expect(locationInput.props.value).toBe("berlin")
    })
  })
})
