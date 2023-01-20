import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

import Header from "./Header"

it("renders without throwing a error", () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  renderWithWrappersLEGACY(<Header gene={gene as any} shortForm={false} />)
})
