import React from "react"
import * as renderer from "react-test-renderer"
import Text from "../TextInput"

import { Theme } from "@artsy/palette"

it("shows an activity indicator when searching ", () => {
  const component = renderer
    .create(
      <Theme>
        <Text
          text={{
            value: "My mocked",
          }}
          searching={true}
        />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})

it("does not have an activity when searching ", () => {
  const component = renderer
    .create(
      <Theme>
        <Text
          text={{
            value: "My mocked",
          }}
          searching={true}
        />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})
