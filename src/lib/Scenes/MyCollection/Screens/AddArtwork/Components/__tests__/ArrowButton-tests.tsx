import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArrowRightIcon } from "palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { ArrowButton } from "../ArrowButton"

describe("ArrowButton", () => {
  it("renders correct components", () => {
    const spy = jest.fn()
    const Noop: React.FC = () => <View />
    const wrapper = renderWithWrappers(
      <ArrowButton onPress={spy}>
        <Noop />
      </ArrowButton>
    )
    expect(wrapper.root.findByType(Noop)).toBeDefined()
    expect(wrapper.root.findByType(ArrowRightIcon)).toBeDefined()
  })

  it("calls onPress callback on click", () => {
    const spy = jest.fn()
    const wrapper = renderWithWrappers(<ArrowButton onPress={spy} />)
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })
})
