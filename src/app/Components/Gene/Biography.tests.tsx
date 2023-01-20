import "react-native"

import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

import Biography from "./Biography"

it("renders without throwing a error", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  renderWithWrappersLEGACY(<Biography gene={gene as any} />)
})
