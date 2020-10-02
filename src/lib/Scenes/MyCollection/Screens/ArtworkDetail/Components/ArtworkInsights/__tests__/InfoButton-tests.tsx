import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { InfoCircleIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { InfoButton } from "../InfoButton"

describe("InfoButton", () => {
  it("renders correct fields", () => {
    const wrapper = renderWithWrappers(<InfoButton title="title" subTitle="subTitle" onPress={jest.fn()} />)
    expect(wrapper.root.findByType(TouchableOpacity)).toBeDefined()
    expect(wrapper.root.findByType(InfoCircleIcon)).toBeDefined()

    const text = extractText(wrapper.root)
    expect(text).toContain("title")
    expect(text).toContain("subTitle")
  })

  it("calls onPress callback when touched", () => {
    const spy = jest.fn()
    const wrapper = renderWithWrappers(<InfoButton title="title" subTitle="subTitle" onPress={spy} />)
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })
})
