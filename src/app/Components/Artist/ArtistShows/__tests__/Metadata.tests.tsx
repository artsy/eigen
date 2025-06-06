import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import Metadata from "app/Components/Artist/ArtistShows/Metadata"

it("renders properly", () => {
  const show = {
    kind: "solo",
    name: "Expansive Exhibition",
    exhibition_period: "Jan 1 - March 1",
    status_update: "Closing in 2 days",
    status: "running",
    partner: {
      name: "Gallery",
    },
    location: {
      city: "Berlin",
    },
  }
  renderWithWrappersLEGACY(<Metadata show={show as any} />)
})
