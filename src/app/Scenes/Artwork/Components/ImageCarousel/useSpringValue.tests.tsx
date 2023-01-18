import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button, Text } from "palette"
import { useState } from "react"
import { Animated } from "react-native"
import { useSpringValue } from "./useSpringValue"

describe("useSpringValue", () => {
  let val: Animated.Value

  const Mock = () => {
    const [epoch, setEpoch] = useState(0)
    val = useSpringValue(epoch, { bounciness: 0, speed: 100 })

    return (
      <Button onPress={() => setEpoch((x) => x + 1)}>
        <Text>Button</Text>
      </Button>
    )
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  // FIXME: JEST_UPGRADE_29 - new timer api
  xit("returns a stable animated value", () => {
    const { getByText } = renderWithWrappers(<Mock />)
    const prevVal = val

    expect(getAnimatedValue(val)).toBe(0)

    fireEvent.press(getByText("Button"))
    jest.advanceTimersByTime(500)

    expect(prevVal).toBe(val)
    expect(getAnimatedValue(val)).toBe(1)

    fireEvent.press(getByText("Button"))
    jest.advanceTimersByTime(500)

    expect(prevVal).toBe(val)
    expect(getAnimatedValue(val)).toBe(2)
  })
})

const getAnimatedValue = (animatedValue: Animated.Value) => {
  return (animatedValue as any)._value
}
