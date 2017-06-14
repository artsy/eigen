import * as BottomAligned from "../../__stories__/bottom_aligned.story"
import storyRunner from "./runner"

storyRunner("Bottom-Aligned states: ", BottomAligned)

import "jest-snapshots-svg"
import * as React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"
import BottomAlignedButton from "../bottom_aligned_button"

it("shows an activity indicator when searching ", () => {
  const sut = (
    <BottomAlignedButton onPress={() => ""}>
      <View />
    </BottomAlignedButton>
  )
  const component = renderer.create(sut).toJSON()
  expect(component).toMatchSVGSnapshot(375, 667)
})
