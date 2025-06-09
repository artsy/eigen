import { SavedItemRow } from "app/Components/Lists/SavedItemRow"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

const props = {
  href: "/artist/petra-collins",
  name: "Petra Collins",
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/GeP7pPxLcVRva8UTzBBGXQ/large.jpg" },
}

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<SavedItemRow {...props} />)
})
