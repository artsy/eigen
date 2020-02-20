import { mount } from "enzyme"
import React, { useState } from "react"
import { View } from "react-native"
import { useSpringValue } from "../useSpringValue"

describe(useSpringValue, () => {
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
    const prevVal = val
    expect(val._value).toBe(0)
    wrapper
      .find(View)
      .props()
      .onMagicTap()
    expect(prevVal).toBe(val)
    jest.runTimersToTime(500)
    expect(val._value).toBe(1)
  })
})
