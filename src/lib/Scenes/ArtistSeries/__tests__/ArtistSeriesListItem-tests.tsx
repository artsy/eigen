import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ArtistSeriesListItem } from "lib/Scenes/ArtistSeries/ArtistSeriesListItem"
import { ArtistSeriesConnectionEdge } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")

describe("ArtistSeriesListItem", () => {
  it("navigates to the artist series when tapped", () => {
    const artistSeriesListItem = renderWithWrappers(<ArtistSeriesListItem listItem={ArtistSeriesListItemFixture} />)

    const instance = artistSeriesListItem.root.findAllByType(TouchableOpacity)[0]

    act(() => instance.props.onPress())

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artist-series/yayoi-kusama-pumpkins"
    )
  })

  it("shows the artist series title, image and for sale artwork counts", () => {
    const artistSeriesListItem = renderWithWrappers(<ArtistSeriesListItem listItem={ArtistSeriesListItemFixture} />)

    const instance = artistSeriesListItem.root.findAllByType(TouchableOpacity)[0]

    expect(instance.findByType(OpaqueImageView).props.imageURL).toBe(
      "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg"
    )
    expect(instance.findByProps({ "data-test-id": "count" }).props.children).toBe("25 Available")
    expect(instance.findByProps({ "data-test-id": "title" }).props.children).toBe("Pumpkins")
  })
})

const ArtistSeriesListItemFixture: ArtistSeriesConnectionEdge = {
  node: {
    slug: "yayoi-kusama-pumpkins",
    internalID: "58597ef5-3390-406b-b6d2-d4e308125d0d",
    title: "Pumpkins",
    forSaleArtworksCount: 25,
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg",
    },
  },
}
