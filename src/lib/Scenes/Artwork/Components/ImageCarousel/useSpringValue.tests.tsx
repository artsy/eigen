// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import React, { useState } from "react"
import { View } from "react-native"
import { useSpringValue } from "./useSpringValue"

describe(useSpringValue, () => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  let val = null

  function Mock() {
    const [epoch, setEpoch] = useState(0)
    val = useSpringValue(epoch, { bounciness: 0, speed: 100 })
    return <View onMagicTap={() => setEpoch((x) => x + 1)} />
  }
  beforeEach(() => {
    jest.useFakeTimers()
  })
  it("returns a stable animated value", () => {
    const wrapper = mount(<Mock />)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const prevVal = val
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(val._value).toBe(0)
    wrapper.find(View).props().onMagicTap()
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(prevVal).toBe(val)
    jest.runTimersToTime(500)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(val._value).toBe(1)
  })
})
