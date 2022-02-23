import { OwnerType } from "@artsy/cohesion"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { ArtistSeriesConnectionEdge } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import { act } from "react-test-renderer"

jest.unmock("react-relay")

describe("ArtistSeriesListItem", () => {
  it("navigates to the artist series when tapped", () => {
    const artistSeriesListItem = renderWithWrappers(
      <ArtistSeriesListItem
        horizontalSlidePosition={2}
        contextScreenOwnerType={OwnerType.artist}
        listItem={ArtistSeriesListItemFixture}
      />
    )

    const instance = artistSeriesListItem.root.findAllByType(Touchable)[0]

    act(() => instance.props.onPress())

    expect(navigate).toHaveBeenCalledWith("/artist-series/yayoi-kusama-pumpkins")
  })

  it("shows the artist series title, image and for sale artwork counts", () => {
    const artistSeriesListItem = renderWithWrappers(
      <ArtistSeriesListItem
        horizontalSlidePosition={2}
        contextScreenOwnerType={OwnerType.artist}
        listItem={ArtistSeriesListItemFixture}
      />
    )

    const instance = artistSeriesListItem.root.findAllByType(Touchable)[0]

    expect(instance.findByType(OpaqueImageView).props.imageURL).toBe(
      "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg"
    )
    expect(instance.findByProps({ testID: "count" }).props.children).toBe("25 available")
    expect(instance.findByProps({ testID: "title" }).props.children).toBe("Pumpkins")
  })
})

const ArtistSeriesListItemFixture: ArtistSeriesConnectionEdge = {
  node: {
    slug: "yayoi-kusama-pumpkins",
    featured: true,
    internalID: "58597ef5-3390-406b-b6d2-d4e308125d0d",
    title: "Pumpkins",
    artworksCountMessage: "25 available",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg",
    },
  },
}
