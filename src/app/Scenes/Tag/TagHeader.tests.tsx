import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"

import Header from "./TagHeader"

it("renders without throwing a error", () => {
  const tag = {
    name: "Handmade Paper",
  }

  renderWithWrappersLEGACY(<Header tag={tag as any} />)
})
