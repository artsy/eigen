import "react-native"

import { renderWithWrappers } from "app/tests/renderWithWrappers"

import Biography from "./Biography"

it("renders without throwing a error", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  renderWithWrappers(<Biography gene={gene as any} />)
})
