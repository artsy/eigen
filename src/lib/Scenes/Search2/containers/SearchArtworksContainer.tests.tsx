import { defaultEnvironment } from "lib/relay/createEnvironment"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { __renderWithPlaceholderTestUtils__ } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"

jest.unmock("react-relay")

describe("SearchArtworks", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => {
    return <SearchArtworksQueryRenderer keyword="keyword" />
  }

  beforeEach(() => {
    mockEnvironment.mockClear()
  })

  it("should render without throwing an error", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artwork: () => ({
        artistNames: "Artist Name",
      }),
    })

    expect(getByText("Artist Name")).toBeTruthy()
  })

  it("should render loading state", () => {
    const { getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

    expect(getByA11yLabel("Search artworks are loading")).toBeTruthy()
  })

  it("should render error state", () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }

    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironment.mock.rejectMostRecentOperation(new Error("Bad connection"))

    expect(getByText("Unable to load")).toBeTruthy()
  })
})
