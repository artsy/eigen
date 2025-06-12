import { Text } from "@artsy/palette-mobile"
import { fireEvent } from "@testing-library/react-native"
import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"
import { Animated, View } from "react-native"

describe(useAnimatedValue, () => {
  let val: Animated.Value

  function Mock() {
    const [epoch, setEpoch] = useState(0)
    val = useAnimatedValue(0)

    return (
      <View onMagicTap={() => setEpoch((x) => x + 1)} accessibilityLabel="button">
        <Text>{"" + epoch}</Text>
      </View>
    )
  }

  it("returns a stable animated value", () => {
    const { getByLabelText } = renderWithWrappers(<Mock />)
    const prevVal = val
    expect(val).toBeInstanceOf(Animated.Value)

    fireEvent.press(getByLabelText("button"))

    expect(prevVal).toBe(val)
  })
})
