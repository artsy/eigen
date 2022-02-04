import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionArtworkQueryRenderer } from "./MyCollectionArtwork"

jest.mock("./OldMyCollectionArtwork.tsx", () => {
  const View = require("react-native/Libraries/Components/View/View")
  return {
    OldMyCollectionArtworkQueryRenderer: () => <View testID="old-my-collection-artwork" />,
  }
})

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

  it("show new my collection artwork page when the feature flag is disabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewMyCollectionArtwork: true })

    const { getByTestId } = renderWithWrappersTL(
      <MyCollectionArtworkQueryRenderer
        artworkSlug="random-slug"
        artistInternalID="internal-id"
        medium="medium"
      />
    )

    expect(getByTestId("my-collection-artwork")).toBeTruthy()
    expect(() => getByTestId("old-my-collection-artwork")).toThrowError(
      "Unable to find an element with testID: old-my-collection-artwork"
    )
  })
})
