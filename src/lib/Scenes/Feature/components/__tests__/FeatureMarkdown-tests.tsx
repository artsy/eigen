import { Theme } from "@artsy/palette"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { create } from "react-test-renderer"
import { FeatureMarkdown } from "../FeatureMarkdown"

describe(FeatureMarkdown, () => {
  it("renders markdown", () => {
    const root = create(
      <Theme>
        <FeatureMarkdown content="this is _some_ **markdown**" />
      </Theme>
    )

    expect(extractText(root.root)).toContain("this is some markdown")
  })
})
