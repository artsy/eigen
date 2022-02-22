import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkDetails } from "../ArtworkDetails"

jest.unmock("react-relay")
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  describe("ArtistAutoSuggest", () => {
    it("renders input correctly", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      expect(getByTestId("Submission_ArtistInput")).toBeTruthy()
    })

    it("has input's value empty initially", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      const artistInput = getByTestId("Submission_ArtistInput")
      expect(artistInput.props.value).toBe("")
    })

    it("mutates the typed value", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      const artistInput = getByTestId("Submission_ArtistInput")

      act(() => fireEvent.changeText(artistInput, "max"))
      expect(artistInput.props.value).toBe("max")
    })
  })
})
