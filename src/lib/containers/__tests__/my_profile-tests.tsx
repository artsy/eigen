import * as React from "react"
import * as renderer from "react-test-renderer"

import { MyProfile } from "../my_profile"

it("looks like expected", () => {
  const props = {
      me: {
        name: "Danger McShane",
      },
    }
  const tree = renderer.create(
    <MyProfile me={props.me} />,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
