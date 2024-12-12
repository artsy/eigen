import { OwnerType } from "@artsy/cohesion"
import { Touchable } from "@artsy/palette-mobile"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { ArtistSeriesConnectionEdge } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"

describe("ArtistSeriesListItem", () => {
  it("navigates to the artist series when tapped", () => {
    const artistSeriesListItem = renderWithWrappersLEGACY(
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
    const artistSeriesListItem = renderWithWrappersLEGACY(
      <ArtistSeriesListItem
        horizontalSlidePosition={2}
        contextScreenOwnerType={OwnerType.artist}
        listItem={ArtistSeriesListItemFixture}
      />
    )

    const instance = artistSeriesListItem.root.findAllByType(Touchable)[0]

    expect(instance.findAllByProps({ testID: "list-item-image" })[0].props.src).toBe(
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
