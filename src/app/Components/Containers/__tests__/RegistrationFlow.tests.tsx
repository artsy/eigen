import { RegistrationFlow } from "app/Components/Containers/RegistrationFlow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("the registration flow", () => {
  it("renders without throwing an error", async () => {
    await renderWithWrappers(<RegistrationFlow saleID="some-sale" />)
  })
})
