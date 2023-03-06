import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Support } from "./Support"

describe("Support", () => {
  it("render", () => {
    const { getByText } = renderWithWrappers(<Support />)

    expect(getByText("Support")).toBeDefined()
    expect(getByText("Inquiries FAQ")).toBeDefined()
  })
})
