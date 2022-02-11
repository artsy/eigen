import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithHookWrappersTL, renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkQueryRenderer } from "./MyCollectionArtwork"

jest.mock("./OldMyCollectionArtwork.tsx", () => {
  const View = require("react-native/Libraries/Components/View/View")
  return {
    OldMyCollectionArtworkQueryRenderer: () => <View testID="old-my-collection-artwork" />,
  }
})

jest.unmock("react-relay")

describe("My Collection Artwork", () => {
  it("show old my collection artwork page when the feature flag is disabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewMyCollectionArtwork: false })

    const { getByTestId } = renderWithWrappersTL(
      <MyCollectionArtworkQueryRenderer
        artworkSlug="random-slug"
        artistInternalID="internal-id"
        medium="medium"
      />
    )

    expect(getByTestId("old-my-collection-artwork")).toBeTruthy()
    expect(() => getByTestId("my-collection-artwork")).toThrowError(
      "Unable to find an element with testID: my-collection-artwork"
    )
  })

  describe("when new my collection artwork feature flag is enabled", () => {
    let mockEnvironment: ReturnType<typeof createMockEnvironment>

    beforeEach(() => {
      mockEnvironment = createMockEnvironment()
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewMyCollectionArtwork: true })
    })

    it("show new artwork screen ", () => {
      const { getByTestId } = renderWithHookWrappersTL(
        <MyCollectionArtworkQueryRenderer
          artworkSlug="random-slug"
          artistInternalID="internal-id"
          medium="medium"
        />,
        mockEnvironment
      )

      mockEnvironmentPayload(mockEnvironment)
      expect(() => getByTestId("my-collection-artwork")).toBeTruthy()
      expect(() => getByTestId("old-my-collection-artwork")).toThrowError(
        "Unable to find an element with testID: old-my-collection-artwork"
      )
    })
  })
})
