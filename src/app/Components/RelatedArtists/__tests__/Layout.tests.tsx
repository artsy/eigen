import { renderWithLayout } from "app/utils/tests/renderWithLayout"
import "react-native"

import RelatedArtists from "app/Components/RelatedArtists/RelatedArtists"

it("renders without throwing an error", () => {
  const artists = [
    {
      id: "artist-sarah-scott",
      name: "Sarah Scott",
      counts: {
        for_sale_artworks: 2,
        artworks: 4,
      },
    },
  ]

  const layout = { width: 768 }

  renderWithLayout(<RelatedArtists artists={artists as any} />, layout)
})
