import * as React from "react"
import * as renderer from "react-test-renderer"

import { MyAccount } from "../my_account"

it("looks like expected", () => {
  const props = {
      me: {
        name: "Danger McShane",
      },
    }
  const tree = renderer.create(
    <MyAccount me={props.me} />,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
