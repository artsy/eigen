import { fireEvent, screen } from "@testing-library/react-native"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PhoneInput", () => {
  let onChange = jest.fn()
  let onChangeText = jest.fn()
  const setValidation = jest.fn()

  beforeEach(() => {
    onChange = jest.fn()
    onChangeText = jest.fn()
  })

  const selectCountry = (countryName: string) => {
    fireEvent.press(screen.getAllByRole("button")[0])
    expect(screen.getByText("Country code")).toBeOnTheScreen()
    fireEvent.changeText(screen.getByPlaceholderText("Type to search..."), countryName)
    // option labels can include the local name, e.g. "Germany (Deutschland)"
    fireEvent.press(screen.getByText(new RegExp(`^${countryName}`)))
  }

  it("provides a Select for the country", () => {
    renderWithWrappers(
      <PhoneInput
        testID="phone-input"
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return true
        }}
      />
    )

    selectCountry("Germany")
    expect(screen.getByText("🇩🇪  +49")).toBeOnTheScreen()
    expect(screen.getByTestId("phone-input")).toHaveDisplayValue("78 25577664")

    selectCountry("France")
    expect(screen.getByText("🇫🇷  +33")).toBeOnTheScreen()
    expect(screen.getByTestId("phone-input")).toHaveDisplayValue("78 25 57 76 64")

    selectCountry("United States")
    expect(screen.getByText("🇺🇸  +1")).toBeOnTheScreen()
    expect(screen.getByTestId("phone-input")).toHaveDisplayValue("(782) 557-7664")
  })

  it("renders an input with the phone number pre-filled", () => {
    renderWithWrappers(
      <PhoneInput
        testID="phone-input"
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={setValidation}
      />
    )

    expect(screen.getAllByTestId("phone-input")).toHaveLength(1)
    expect(screen.getByText("🇬🇧  +44")).toBeOnTheScreen()
    expect(screen.getByTestId("phone-input")).toHaveDisplayValue("7825 577664")
  })

  it("shows custom error message, when error is controlled and phone number is invalid", () => {
    renderWithWrappers(
      <PhoneInput
        testID="phone-input"
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

    fireEvent.changeText(screen.getByTestId("phone-input"), "")

    expect(screen.getByText("custom error message")).toBeOnTheScreen()
  })

  it("shows local error message when parent does not control error and phone number is invalid", async () => {
    renderWithWrappers(
      <PhoneInput
        testID="phone-input"
        value="447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={() => {
          return false
        }}
      />
    )

    fireEvent.changeText(screen.getByTestId("phone-input"), "")

    // validation is async (validatePhoneNumber)
    expect(await screen.findByText("Please enter a valid phone number.")).toBeOnTheScreen()
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
    renderWithWrappers(
      <PhoneInput
        testID="phone-input"
        value="+447825577664"
        onChange={onChange}
        onChangeText={onChangeText}
        setValidation={setValidation}
      />
    )
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeText).not.toHaveBeenCalled()

    fireEvent.changeText(screen.getByTestId("phone-input"), "999")
    expect(onChange).toHaveBeenCalledWith("+44 999")
    expect(onChangeText).toHaveBeenCalledWith("+44 999")

    selectCountry("United States")
    expect(onChange).toHaveBeenCalledWith("+1 (999) ")
    expect(onChangeText).toHaveBeenCalledWith("+1 (999) ")
  })
})
