// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import React, { useState } from "react"
import { View } from "react-native"
import { useSpringValue } from "../useSpringValue"

describe(useSpringValue, () => {
  // @ts-ignore STRICTNESS_MIGRATION
  let val = null

  function Mock() {
    const [epoch, setEpoch] = useState(0)
    val = useSpringValue(epoch, { bounciness: 0, speed: 100 })
    return <View onMagicTap={() => setEpoch(x => x + 1)} />
  }
  beforeEach(() => {
    jest.useFakeTimers()
  })
  it("returns a stable animated value", () => {
    const wrapper = mount(<Mock />)
    // @ts-ignore STRICTNESS_MIGRATION
    const prevVal = val
    // @ts-ignore STRICTNESS_MIGRATION
    expect(val._value).toBe(0)
    wrapper
      .find(View)
      .props()
      .onMagicTap()
    // @ts-ignore STRICTNESS_MIGRATION
    expect(prevVal).toBe(val)
    jest.runTimersToTime(500)
    // @ts-ignore STRICTNESS_MIGRATION
    expect(val._value).toBe(1)
  })
})
