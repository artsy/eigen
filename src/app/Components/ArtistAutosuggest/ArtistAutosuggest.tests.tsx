import { fireEvent } from "@testing-library/react-native"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { ArtworkDetails } from "../../Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/ArtworkDetails"

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={getMockRelayEnvironment()}>
      <ArtworkDetails handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

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

      act(() => fireEvent.changeText(artistInput, "max"))
      expect(artistInput.props.value).toBe("max")
    })
  })
})
