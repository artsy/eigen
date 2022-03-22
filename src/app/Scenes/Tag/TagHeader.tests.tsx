import { renderWithWrappers } from "app/tests/renderWithWrappers"

import Header from "./TagHeader"

it("renders without throwing a error", () => {
  const tag = {
    name: "Handmade Paper",
  }

  renderWithWrappers(<Header tag={tag as any} />)
})
