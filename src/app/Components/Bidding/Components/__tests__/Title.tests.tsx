import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

import { Title } from "app/Components/Bidding/Components/Title"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<Title>Confirm your bid</Title>)
})
