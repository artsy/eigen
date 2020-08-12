import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { FairBoothPreviewHeader } from "../FairBoothPreviewHeader"

describe("FairBoothPreviewHeader", () => {
  it("renders without throwing an error", () => {
    renderWithWrappers(
      <FairBoothPreviewHeader
        name="A Partner"
        location="Booth 21"
        url="http://placehold.it/200x200"
        onViewFairBoothPressed={jest.fn()}
      />
    )
  })
})
