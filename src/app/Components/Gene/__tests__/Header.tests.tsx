import Header from "app/Components/Gene/Header"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing a error", async () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  await expect(
    renderWithWrappers(<Header gene={gene as any} shortForm={false} />)
  ).resolves.not.toThrow()
})
