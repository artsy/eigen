import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ShowHeader } from "../index"

it("looks correct when rendered", () => {
  const show = {
    name: "foo",
    description: "bar",
    press_release: "foo bar",
    exhibition_period: "now - later",
    status_update: "now",
    images: [{ url: "image", aspect_ratio: 1.0 }],
  }

  const onSaveShowPressed = () => Promise.resolve()
  const onMoreInformationPressed = () => {
    /** noop */
  }
  const comp = renderer.create(
    <ShowHeader
      show={show as any}
      onSaveShowPressed={onSaveShowPressed}
      onMoreInformationPressed={onMoreInformationPressed}
    />
  )
  expect(comp).toMatchSnapshot()
})
