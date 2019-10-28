import React from "react"
import "react-native"

import { getTestWrapper } from "lib/utils/getTestWrapper"
import { ZeroState } from "../ZeroState"

it("presents the title and subtitle", () => {
  const title = "A title for the zero state"
  const subtitle = "the subtitle for zero state"
  const { text } = getTestWrapper(<ZeroState title={title} subtitle={subtitle} />)
  expect(text).toContain(title)
  expect(text).toContain(subtitle)
})
