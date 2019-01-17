import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ShowHeader } from "../index"
it("looks correct when rendered", () => {
  const onSaveShowPressed = () => Promise.resolve()
  const onMoreInformationPressed = () => {
    /** noop */
  }
  const onViewAllArtistsPressed = () => {
    /** noop */
  }
  const comp = renderer.create(
    <ShowHeader
      show={ShowFixture as any}
      onSaveShowPressed={onSaveShowPressed}
      onMoreInformationPressed={onMoreInformationPressed}
      onViewAllArtistsPressed={onViewAllArtistsPressed}
    />
  )
  expect(comp).toMatchSnapshot()
})
