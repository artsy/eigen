import { mount } from "enzyme"
import React, { useState } from "react"
import { Animated, View } from "react-native"
import { useAnimatedValue } from "../useAnimatedValue"

describe(useAnimatedValue, () => {
  let val = null

  function Mock() {
    const [epoch, setEpoch] = useState(0)
    val = useAnimatedValue(0)
    return <View onMagicTap={() => setEpoch(x => x + 1)} accessibilityLabel={"" + epoch} />
  }
  it("returns a stable animated value", () => {
    const wrapper = mount(<Mock />)
    const prevVal = val
    expect(val).toBeInstanceOf(Animated.Value)
    wrapper
      .find(View)
      .props()
      .onMagicTap()
    expect(prevVal).toBe(val)
  })
})
