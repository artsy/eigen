import { Theme } from "@artsy/palette"
import React from "react"
import { create } from "react-test-renderer"
import { FairBoothPreviewHeader } from "../FairBoothPreviewHeader"

describe("FairBoothPreviewHeader", () => {
  it("renders without throwing an error", () => {
    create(
      <Theme>
        <FairBoothPreviewHeader
          name="A Partner"
          location="Booth 21"
          url="http://placehold.it/200x200"
          onViewFairBoothPressed={jest.fn()}
        />
      </Theme>
    )
  })
})
