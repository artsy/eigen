import Header from "app/Components/Gene/Header"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing a error", () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  expect(() => renderWithWrappers(<Header gene={gene as any} shortForm={false} />)).not.toThrow()
})
