import { screen } from "@testing-library/react-native"
import { TrendingArtistsAvatarsRail } from "app/Scenes/Search/TrendingSearches/components/TrendingArtistsAvatarsRail"
import { TrendingArtist } from "app/Scenes/Search/TrendingSearches/useTrendingSearches"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const artist = (id: string, name: string): TrendingArtist => ({
  internalID: id,
  slug: id,
  name,
  href: `/artist/${id}`,
  coverArtwork: {
    image: {
      url: `https://example.com/${id}.jpg`,
      blurhash: null,
    },
  },
})

describe("TrendingArtistsAvatarsRail", () => {
  it("returns nothing when the artists array is empty", () => {
    renderWithWrappers(<TrendingArtistsAvatarsRail artists={[]} />)

    expect(screen.queryByText("Trending Artists")).not.toBeOnTheScreen()
  })

  it("renders the default title and each artist's name", () => {
    renderWithWrappers(
      <TrendingArtistsAvatarsRail artists={[artist("banksy", "Banksy"), artist("kaws", "KAWS")]} />
    )

    expect(screen.getByText("Trending Artists")).toBeOnTheScreen()
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("KAWS")).toBeOnTheScreen()
  })
})
