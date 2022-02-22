import React from "react"
import "react-native"

import { getTestWrapper } from "app/utils/getTestWrapper"
import { ZeroState } from "./ZeroState"

it("presents the title and subtitle", () => {
  const title = "A title for the zero state"
  const subtitle = "the subtitle for zero state"
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const { text } = getTestWrapper(<ZeroState title={title} subtitle={subtitle} />)
  expect(text).toContain(title)
  expect(text).toContain(subtitle)
})
