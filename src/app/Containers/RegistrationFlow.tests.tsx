import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"

import { RegistrationFlow } from "./RegistrationFlow"

jest.unmock("react-relay")

describe("the registration flow", () => {
  it("renders without throwing an error", () => {
    renderWithWrappers(<RegistrationFlow saleID="some-sale" />)
  })
})
