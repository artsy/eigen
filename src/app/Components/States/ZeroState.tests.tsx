import "react-native"

import { getTestWrapper } from "app/utils/getTestWrapper"
import { ZeroState } from "./ZeroState"

it("presents the title and subtitle", () => {
  const title = "A title for the zero state"
  const subtitle = "the subtitle for zero state"
  const wrapper = getTestWrapper(<ZeroState title={title} subtitle={subtitle} />)
  expect(wrapper?.text).toContain(title)
  expect(wrapper?.text).toContain(subtitle)
})
