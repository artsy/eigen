import { fireEvent, screen } from "@testing-library/react-native"
import RelatedArtists from "app/Components/RelatedArtists/RelatedArtists"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

  renderWithWrappers(<RelatedArtists artists={artists as any} />)

  // the layout event bubbles up to the container view that handles `onLayout`
  fireEvent(screen.getByText("Related Artists"), "layout", {
    nativeEvent: { layout: { width: 768, height: 0, x: 0, y: 0 } },
  })

  expect(screen.getByText("Related Artists")).toBeOnTheScreen()
})
