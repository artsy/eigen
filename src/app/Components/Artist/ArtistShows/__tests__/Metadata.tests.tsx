import { screen } from "@testing-library/react-native"
import Metadata from "app/Components/Artist/ArtistShows/Metadata"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders properly", async () => {
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
  await renderWithWrappers(<Metadata show={show as any} />)

  expect(screen.getByText("Gallery")).toBeOnTheScreen()
  expect(screen.getByText("Expansive Exhibition")).toBeOnTheScreen()
  expect(screen.getByText("Berlin, Jan 1 - March 1")).toBeOnTheScreen()
})
