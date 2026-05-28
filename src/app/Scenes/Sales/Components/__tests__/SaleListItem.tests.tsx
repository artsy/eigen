import { screen } from "@testing-library/react-native"
import SaleListItem from "app/Scenes/Sales/Components/SaleListItem"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SaleListItem", () => {
  it("renders without throwing an error", () => {
    renderWithWrappers(
      <SaleListItem sale={props as any} containerWidth={750} index={0} columnCount={4} />
    )
  })

  describe("SalesRail Subtitle", () => {
    it("renders formattedStartDateTime as the subtitle", () => {
      renderWithWrappers(
        <SaleListItem sale={props as any} containerWidth={750} index={0} columnCount={4} />
      )

      expect(screen.getByText(props.formattedStartDateTime)).toBeDefined()
    })
  })
})

const props = {
  id: "freemans-modern-and-contemporary-works-of-art",
  name: "Freeman's: Modern & Contemporary Works of Art",
  href: "http://foo.bar",
  is_open: true,
  is_live_open: false,
  start_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  end_at: null,
  registration_ends_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  live_url_if_open: null,
  formattedStartDateTime: "Live May 19 at 11:00pm CEST",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/eeqLfwMMAYA8XOmeYEb7Rg/source.jpg",
  },
}
