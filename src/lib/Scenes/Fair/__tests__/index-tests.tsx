import { getTextTree } from "lib/utils/getTestWrapper"
import React from "react"
import Fair from "../"

it("Renders a fair", () => {
  const fair = { name: "My Fair Lady Fair" }
  const textRepresentation = getTextTree(<Fair fair={fair as any} />)
  expect(textRepresentation).toContain(fair.name)
})
