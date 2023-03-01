import { fireEvent } from "@testing-library/react-native"
import { ArtworkDetails } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/ArtworkDetails"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} isLastStep />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  describe("ArtistAutoSuggest", () => {
    it("renders input correctly", () => {
      const { getByTestId } = renderWithWrappers(<TestRenderer />)
      expect(getByTestId("Submission_ArtistInput")).toBeTruthy()
    })

    it("has input's value empty initially", () => {
      const { getByTestId } = renderWithWrappers(<TestRenderer />)
      const artistInput = getByTestId("Submission_ArtistInput")
      expect(artistInput.props.value).toBe("")
    })

    it("mutates the typed value", () => {
      const { getByTestId } = renderWithWrappers(<TestRenderer />)
      const artistInput = getByTestId("Submission_ArtistInput")

      fireEvent.changeText(artistInput, "max")
      expect(artistInput.props.value).toBe("max")
    })
  })
})
