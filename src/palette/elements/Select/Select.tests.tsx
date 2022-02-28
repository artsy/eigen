import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Input, Text, Touchable } from "palette"
import React from "react"
import { Modal, TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { Select } from "./Select"

const options = [
  {
    label: "Option 1",
    value: "option-1",
    searchTerms: ["Option 1"],
  },
  {
    label: "Option 2",
    value: "option-2",
    searchTerms: ["Option 2"],
  },
]

it("shows title and subtitle within the select", () => {
  const component = renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      options={options}
      value="option-1"
      onSelectValue={() => null}
    />
  )

  expect(component.root.findAllByType(Text)[0].props.children).toEqual(["Title", false, false])
  expect(component.root.findAllByType(Text)[1].props.children).toEqual("Subtitle")
})

it("selects correct value", async () => {
  const onSelectValue = jest.fn()

  const component = renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  await act(() => component.root.findAllByType(TouchableOpacity)[0].props.onPress())

  const selectModal = component.root.findAllByType(Modal)[0]
  selectModal.findAllByType(Touchable)[1].props.onPress()

  expect(onSelectValue).toHaveBeenCalledWith("option-2", 1)
})

it("filters on search", async () => {
  const onSelectValue = jest.fn()

  const component = renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      enableSearch
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  await act(() => component.root.findAllByType(TouchableOpacity)[0].props.onPress())

  const input = component.root.findAllByType(Input)[0]
  input.props.onChangeText("Option 2")

  const selectModal = component.root.findAllByType(Modal)[0]

  expect(selectModal.findAllByType(Touchable).length).toEqual(1)
  expect(extractText(selectModal.findAllByType(Touchable)[0].findAllByType(Text)[0])).toEqual(
    "Option 2"
  )
})
