import { mount } from "enzyme"
import React from "react"

import { Text, View } from "react-native"
import { Portal, PortalProvider } from "../Portal"

describe("Portal", () => {
  it("Renders children as children of PortalProvider", () => {
    const tree = mount(
      <PortalProvider>
        <View>
          <Text>Foo Bar</Text>
          <Portal>
            <Text>Bar Baz</Text>
          </Portal>
        </View>
      </PortalProvider>
    )
    expect(
      tree
        .find(PortalProvider)
        .children(Text)
        .text()
    ).toBe("Bar Baz")
  })
})
