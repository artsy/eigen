import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

import { RegistrationFlow } from "./RegistrationFlow"


describe("the registration flow", () => {
  it("renders without throwing an error", () => {
    renderWithWrappersLEGACY(<RegistrationFlow saleID="some-sale" />)
  })
})
