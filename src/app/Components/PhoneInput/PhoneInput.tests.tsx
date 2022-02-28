import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Input, Text } from "palette"
import { Select } from "palette/elements/Select"
import React from "react"
import { act } from "react-test-renderer"
import { PhoneInput } from "./PhoneInput"

describe("PhoneInput", () => {
  let onChange = jest.fn()
  let onChangeText = jest.fn()
  const setValidation = jest.fn()

  beforeEach(() => {
    onChange = jest.fn()
    onChangeText = jest.fn()
  })

  it("renders an input with the phone number pre-filled", () => {
    const tree = renderWithWrappers(
      <PhoneInput
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={setValidation}
      />
    )
    expect(tree.root.findAllByType(Input)).toHaveLength(1)
    expect(extractText(tree.root.findByType(Input))).toBe("🇬🇧+447825 577664")
    tree.root.findByType(Input).props.onChangeText("999")
    expect(extractText(tree.root.findByType(Input))).toBe("🇬🇧+44999")
    tree.root.findByType(Input).props.onChangeText("9998764")
    expect(extractText(tree.root.findByType(Input))).toBe("🇬🇧+449998 764")
  })
  it("renders an input with the phone number pre-filled", () => {
    const tree = renderWithWrappers(
      <PhoneInput
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={setValidation}
      />
    )
    expect(tree.root.findAllByType(Input)).toHaveLength(1)
    expect(extractText(tree.root.findByType(Input))).toBe("🇬🇧+447825 577664")
    tree.root.findByType(Input).props.onChangeText("999")
    expect(extractText(tree.root.findByType(Input))).toBe("🇬🇧+44999")
    tree.root.findByType(Input).props.onChangeText("9998764")
    expect(extractText(tree.root.findByType(Input))).toBe("🇬🇧+449998 764")
  })

  it("provides a Select for the country", () => {
    const tree = renderWithWrappers(
      <PhoneInput
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return true
        }}
      />
    )

    expect(tree.root.findAllByType(Select)).toHaveLength(1)
    tree.root.findByType(Select).props.onSelectValue("de")
    expect(extractText(tree.root)).toContain("🇩🇪+4978 25577664")
    tree.root.findByType(Select).props.onSelectValue("fr")
    expect(extractText(tree.root)).toContain("🇫🇷+3378 25 57 76 64")
    tree.root.findByType(Select).props.onSelectValue("us")
    expect(extractText(tree.root)).toContain("🇺🇸+1(782) 557-7664")
  })

  it("calls onChange and onChangeText when the value changes", () => {
    const tree = renderWithWrappers(
      <PhoneInput
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={setValidation}
      />
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
    expect(onChange).toHaveBeenCalledWith("+1 (999) ")
    expect(onChangeText).toHaveBeenCalledWith("+1 (999) ")
  })

  it("shows a validation message when a phone number is invalid", () => {
    const tree = renderWithWrappers(
      <PhoneInput
        value="447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return false
        }}
      />
    )

    act(() => {
      tree.root.findByType(Input).props.onChangeText("")
    })

    expect(tree.root.findAllByType(Text)[2].props.children).toBe("This phone number is incomplete")
  })

  it("does not show a validation message when phone number valid", () => {
    const tree = renderWithWrappers(
      <PhoneInput
        value=""
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return true
        }}
      />
    )

    act(() => {
      tree.root.findByType(Input).props.onChangeText("6466464646")
    })

    expect(tree.root.findAllByType(Text)[2].props.children).toBe("")
  })
})
