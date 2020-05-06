import React from "react"
import * as renderer from "react-test-renderer"
import Text from "../TextInput"

import { Theme } from "@artsy/palette"
import { ActivityIndicator } from "react-native"

it("shows an activity indicator when searching ", () => {
  const component = renderer.create(
    <Theme>
      <Text
        text={{
          value: "My mocked",
        }}
        searching={true}
      />
    </Theme>
  )
  expect(component.root.findAllByType(ActivityIndicator)).toHaveLength(1)
})

it("does not have an activity when searching ", () => {
  const component = renderer.create(
    <Theme>
      <Text
        text={{
          value: "My mocked",
        }}
        searching={false}
      />
    </Theme>
  )
  expect(component.root.findAllByType(ActivityIndicator)).toHaveLength(0)
})
