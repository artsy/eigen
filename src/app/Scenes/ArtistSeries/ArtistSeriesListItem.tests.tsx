import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { ArtistSeriesConnectionEdge } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtistSeriesListItem", () => {
  it("navigates to the artist series when tapped", () => {
    renderWithWrappers(
      <ArtistSeriesListItem
        horizontalSlidePosition={2}
        contextScreenOwnerType={OwnerType.artist}
        listItem={ArtistSeriesListItemFixture}
      />
    )

    fireEvent.press(screen.getByTestId("list-item-image"))

    expect(navigate).toHaveBeenCalledWith("/artist-series/yayoi-kusama-pumpkins")
  })

  it("shows the artist series title, image and for sale artwork counts", () => {
    renderWithWrappers(
      <ArtistSeriesListItem
        horizontalSlidePosition={2}
        contextScreenOwnerType={OwnerType.artist}
        listItem={ArtistSeriesListItemFixture}
      />
    )

    expect(screen.getByText("Pumpkins")).toBeOnTheScreen()
    expect(screen.getByText("25 available")).toBeOnTheScreen()

    expect(screen.getByTestId("list-item-image")).toBeOnTheScreen()

    fireEvent.press(screen.getByLabelText("Artist Series List Item"))

    expect(navigate).toHaveBeenCalledWith("/artist-series/yayoi-kusama-pumpkins")
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
