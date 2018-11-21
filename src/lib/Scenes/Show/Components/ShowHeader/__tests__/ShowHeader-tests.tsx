import { ShowFixture } from "lib/Scenes/Show/__fixtures__"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ShowHeader } from "../index"
it("looks correct when rendered", () => {
  const onSaveShowPressed = () => Promise.resolve()
  const onMoreInformationPressed = () => {
    /** noop */
  }
  const comp = renderer.create(
    <ShowHeader
      show={ShowFixture.show as any}
      onSaveShowPressed={onSaveShowPressed}
      onMoreInformationPressed={onMoreInformationPressed}
    />
  )
  expect(comp).toMatchSnapshot()
})
