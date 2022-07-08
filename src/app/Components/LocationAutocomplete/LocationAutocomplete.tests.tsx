import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { LocationAutocomplete } from "./LocationAutocomplete"

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
      const { getByTestId, getByPlaceholderText } = renderWithWrappers(<TestRenderer />)
      expect(getByTestId("Submission_LocationInput")).toBeTruthy()
      expect(getByPlaceholderText("Enter city where artwork is located")).toBeTruthy()
    })

    it("has input's value empty initially", () => {
      const { getByTestId } = renderWithWrappers(<TestRenderer />)
      const locationInput = getByTestId("Submission_LocationInput")
      expect(locationInput.props.value).toBe("")
    })

    it("mutates the typed value", () => {
      const { getByTestId } = renderWithWrappers(<TestRenderer />)
      const locationInput = getByTestId("Submission_LocationInput")

      fireEvent.changeText(locationInput, "berlin")
      expect(locationInput.props.value).toBe("berlin")
    })

    it("displays a message when no location is found", async () => {
      const { getByText, getByTestId } = renderWithWrappers(<TestRenderer />)

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
