import React from "react"
import * as renderer from "react-test-renderer"

import { MyProfile } from "../MyProfile"

import { Theme } from "@artsy/palette"

it("looks like expected", () => {
  const props = {
    me: {
      name: "Danger McShane",
      initials: "DM",
    },
  }
  const tree = renderer
    .create(
      <Theme>
        <MyProfile me={props.me as any} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
