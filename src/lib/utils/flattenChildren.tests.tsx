import React from "react"
import { View } from "react-native"
import { flattenChildren } from "./flattenChildren"

describe("flattenChildren", () => {
  it("flattens the children", () => {
    const flattened = flattenChildren(
      <>
        <View>one</View>
        <View>two</View>
        <>
          <View>three</View>
          <>
            <View>four</View>
          </>
        </>
      </>
    )

    expect(flattened).toHaveLength(4)
  })
})
