import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { InfoCircleIcon, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { InfoButton } from "./InfoButton"

describe("InfoButton", () => {
  it("renders a button", () => {
    const wrapper = renderWithWrappers(
      <InfoButton title="title" subTitle="subTitle" modalContent={<Text>Hello</Text>} />
    )
    expect(wrapper.root.findByType(TouchableOpacity)).toBeDefined()
    expect(wrapper.root.findByType(InfoCircleIcon)).toBeDefined()

    const text = extractText(wrapper.root)
    expect(text).toContain("title")
    expect(text).toContain("subTitle")
  })

  it("only shows the modal when the button is pressed", () => {
    const wrapper = renderWithWrappers(
      <InfoButton
        title="title"
        subTitle="subTitle"
        modalContent={<Text testID="hello">Hello</Text>}
      />
    )
    expect(wrapper.root.findByType(FancyModal).props.visible).toBe(false)
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(wrapper.root.findByType(FancyModal).props.visible).toBe(true)
  })

  it("calls onPress arg if it's passed in", () => {
    const handlePress = jest.fn()
    const wrapper = renderWithWrappers(
      <InfoButton
        title="title"
        subTitle="subTitle"
        modalContent={<Text>Hello</Text>}
        onPress={handlePress}
      />
    )
    wrapper.root.findByType(TouchableOpacity).props.onPress()

    expect(handlePress).toHaveBeenCalledTimes(1)
  })
})
