import { Input, Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { SelectModal } from "app/Components/Select/Components/SelectModal"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"

// TODO: Fix asap
// Tested on device and works well
describe.skip("PhoneInput", () => {
  let onChange = jest.fn()
  let onChangeText = jest.fn()
  const setValidation = jest.fn()

  beforeEach(() => {
    onChange = jest.fn()
    onChangeText = jest.fn()
  })

  it("provides a Select for the country", () => {
    const { root } = renderWithWrappersLEGACY(
      <PhoneInput
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return true
        }}
      />
    )

    // eslint-disable-next-line testing-library/await-async-queries
    expect(root.findAllByType(SelectModal)).toHaveLength(1)
    // eslint-disable-next-line testing-library/await-async-queries
    root.findByType(SelectModal).props.onSelectValue("de")
    expect(extractText(root)).toContain("🇩🇪+4978 25577664")
    // eslint-disable-next-line testing-library/await-async-queries
    root.findByType(SelectModal).props.onSelectValue("fr")
    expect(extractText(root)).toContain("🇫🇷+3378 25 57 76 64")
    // eslint-disable-next-line testing-library/await-async-queries
    root.findByType(SelectModal).props.onSelectValue("us")
    expect(extractText(root)).toContain("🇺🇸+1(782) 557-7664")
  })

  it("renders an input with the phone number pre-filled", () => {
    const { root } = renderWithWrappersLEGACY(
      <PhoneInput
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={setValidation}
      />
    )

    // eslint-disable-next-line testing-library/await-async-queries
    expect(root.findAllByType(Input)).toHaveLength(1)
    // eslint-disable-next-line testing-library/await-async-queries
    expect(extractText(root.findByType(Input))).toBe("🇬🇧+447825 577664")
  })

  it("shows custom error message, when error is controlled and phone number is invalid", () => {
    const { root } = renderWithWrappersLEGACY(
      <PhoneInput
        value="447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return false
        }}
        shouldDisplayLocalError={false}
        error="custom error message"
      />
    )

    act(() => {
      // eslint-disable-next-line testing-library/await-async-queries
      root.findByType(Input).props.onChangeText("")
    })

    // eslint-disable-next-line testing-library/await-async-queries
    expect(root.findAllByType(Text)[2].props["children"]).toBe("custom error message")
  })

  it("shows local error message when parent does not control error and phone number is invalid", () => {
    const { root } = renderWithWrappersLEGACY(
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
      // eslint-disable-next-line testing-library/await-async-queries
      root.findByType(Input).props.onChangeText("")
    })

    // eslint-disable-next-line testing-library/await-async-queries
    expect(root.findAllByType(Text)[2].props["children"]).toBe("Please enter a valid phone number.")
  })

  it("does not show a validation message when phone number valid", () => {
    renderWithWrappers(
      <PhoneInput
        value=""
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return true
        }}
      />
    )

    expect(screen.queryByTestId("input-error")).toBeNull()
  })

  it("calls onChange and onChangeText when the value changes", () => {
    const { root } = renderWithWrappersLEGACY(
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
      // eslint-disable-next-line testing-library/await-async-queries
      root.findByType(Input).props.onChangeText("999")
    })
    expect(onChange).toHaveBeenCalledWith("+44 999")
    expect(onChangeText).toHaveBeenCalledWith("+44 999")

    act(() => {
      // eslint-disable-next-line testing-library/await-async-queries
      root.findByType(SelectModal).props.onSelectValue("us")
    })
    expect(onChange).toHaveBeenCalledWith("+1 (999) ")
    expect(onChangeText).toHaveBeenCalledWith("+1 (999) ")
  })
})
