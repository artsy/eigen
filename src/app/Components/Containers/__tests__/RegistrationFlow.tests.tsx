import { RegistrationFlow } from "app/Components/Containers/RegistrationFlow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("the registration flow", () => {
  it("renders without throwing an error", () => {
    renderWithWrappers(<RegistrationFlow saleID="some-sale" />)
  })
})
