import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import "react-native"

import { Title } from "./Title"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<Title>Confirm your bid</Title>)
})
