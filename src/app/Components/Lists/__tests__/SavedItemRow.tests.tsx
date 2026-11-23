import { screen } from "@testing-library/react-native"
import { SavedItemRow } from "app/Components/Lists/SavedItemRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const props = {
  href: "/artist/petra-collins",
  name: "Petra Collins",
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/GeP7pPxLcVRva8UTzBBGXQ/large.jpg" },
}

it("renders without throwing an error", () => {
  renderWithWrappers(<SavedItemRow {...props} />)

  expect(screen.getByText("Petra Collins")).toBeOnTheScreen()
})
