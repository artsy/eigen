// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import React, { useState } from "react"
import { Animated, View } from "react-native"
import { useAnimatedValue } from "./useAnimatedValue"

describe(useAnimatedValue, () => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  let val = null

  function Mock() {
    const [epoch, setEpoch] = useState(0)
    val = useAnimatedValue(0)
    return <View onMagicTap={() => setEpoch((x) => x + 1)} accessibilityLabel={"" + epoch} />
  }
  it("returns a stable animated value", () => {
    const wrapper = mount(<Mock />)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const prevVal = val
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(val).toBeInstanceOf(Animated.Value)
    wrapper.find(View).props().onMagicTap()
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(prevVal).toBe(val)
  })
})
