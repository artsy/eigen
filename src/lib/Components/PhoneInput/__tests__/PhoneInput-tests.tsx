import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { act } from "react-test-renderer"
import { PhoneInput } from "../PhoneInput"

describe("PhoneInput", () => {
  let onChange = jest.fn()
  let onChangeText = jest.fn()
  beforeEach(() => {
    onChange = jest.fn()
    onChangeText = jest.fn()
  })
  it("renders an input with the phone number pre-filled", () => {
    const tree = renderWithWrappers(
      <PhoneInput value="+447825577664" onChange={onChange} onChangeText={onChangeText} />
    )
    expect(tree.root.findAllByType(Input)).toHaveLength(1)
    expect(extractText(tree.root.findByType(Input))).toBe("+447825577664")
    tree.root.findByType(Input).props.onChangeText("999")
    expect(extractText(tree.root.findByType(Input))).toBe("+44999")
  })

  it("provides a Select for the country", () => {
    const tree = renderWithWrappers(
      <PhoneInput value="+447825577664" onChange={onChange} onChangeText={onChangeText} />
    )
    expect(tree.root.findAllByType(Select)).toHaveLength(1)
    tree.root.findByType(Select).props.onSelectValue("de")
    expect(extractText(tree.root)).toBe("+497825577664")
    tree.root.findByType(Select).props.onSelectValue("fr")
    expect(extractText(tree.root)).toBe("+337825577664")
    tree.root.findByType(Select).props.onSelectValue("us")
    expect(extractText(tree.root)).toBe("+17825577664")
  })

  it("calls onChange and onChangeText when the value changes", () => {
    const tree = renderWithWrappers(
      <PhoneInput value="+447825577664" onChange={onChange} onChangeText={onChangeText} />
    )
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeText).not.toHaveBeenCalled()

    act(() => {
      tree.root.findByType(Input).props.onChangeText("999")
    })
    expect(onChange).toHaveBeenCalledWith("+44 999")
    expect(onChangeText).toHaveBeenCalledWith("+44 999")

    act(() => {
      tree.root.findByType(Select).props.onSelectValue("us")
    })
    expect(onChange).toHaveBeenCalledWith("+1 999")
    expect(onChangeText).toHaveBeenCalledWith("+1 999")
  })
})
