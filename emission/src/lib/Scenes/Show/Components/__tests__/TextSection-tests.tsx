import { mount } from "enzyme"
import React from "react"
import { View } from "react-native"

import { TextSection } from "../TextSection"

describe("TextSection", () => {
  it("renders properly", () => {
    const tree = mount(
      <View>
        <TextSection title="This is a title" text="This is text" />
      </View>
    )

    expect(tree.text()).toContain("This is a title")
    expect(tree.text()).toContain("This is text")
  })
})
