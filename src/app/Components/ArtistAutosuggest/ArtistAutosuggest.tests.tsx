import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkDetails } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/ArtworkDetails"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"

const mockEnvironment = getMockRelayEnvironment()

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} isLastStep scrollToTop={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  describe("ArtistAutoSuggest", () => {
    it("renders input correctly", () => {
      renderWithWrappers(<TestRenderer />)
      expect(screen.getByTestId("Submission_ArtistInput")).toBeTruthy()
    })

    it("has input's value empty initially", () => {
      renderWithWrappers(<TestRenderer />)
      const artistInput = screen.getByTestId("Submission_ArtistInput")
      expect(artistInput.props.value).toBe("")
    })

    it("mutates the typed value", () => {
      renderWithWrappers(<TestRenderer />)
      const artistInput = screen.getByTestId("Submission_ArtistInput")

      fireEvent.changeText(artistInput, "max")
      expect(artistInput.props.value).toBe("max")
    })
  })
})
