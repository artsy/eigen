import * as React from "react"
import * as renderer from "react-test-renderer"

import { MyProfile } from "../MyProfile"

it("looks like expected", () => {
  const props = {
    me: {
      name: "Danger McShane",
      initials: "DM",
    },
  }
  const tree = renderer.create(<MyProfile me={props.me} />).toJSON()
  expect(tree).toMatchSnapshot()
})
