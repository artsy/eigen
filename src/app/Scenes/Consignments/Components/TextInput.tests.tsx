import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { ActivityIndicator } from "react-native"
import Text from "./TextInput"

it("shows an activity indicator when searching ", () => {
  const component = renderWithWrappers(
    <Text
      text={{
        value: "My mocked",
      }}
      searching
    />
  )
  expect(component.root.findAllByType(ActivityIndicator)).toHaveLength(1)
})

it("does not have an activity when searching ", () => {
  const component = renderWithWrappers(
    <Text
      text={{
        value: "My mocked",
      }}
      searching={false}
    />
  )
  expect(component.root.findAllByType(ActivityIndicator)).toHaveLength(0)
})
