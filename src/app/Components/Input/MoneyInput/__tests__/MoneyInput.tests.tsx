import { Input, Text } from "@artsy/palette-mobile"
import { screen, waitFor } from "@testing-library/react-native"
import { MoneyInput } from "app/Components/Input/MoneyInput/MoneyInput"
import { deformatMoney, formatMoney } from "app/Components/Input/MoneyInput/moneyInputHelpers"
import { SelectModal } from "app/Components/Select/Components/SelectModal"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"

describe("MoneyInput", () => {
  let onChange = jest.fn()

  beforeEach(() => {
    onChange = jest.fn()
  })

  it("provides a Select for Currency", () => {
    renderWithWrappers(<MoneyInput initialValues={{ currency: "EUR" }} onChange={onChange} />)
    expect(screen.UNSAFE_getAllByType(SelectModal)).toHaveLength(1)
    expect(screen.getByText("EUR")).toBeDefined()
    expect(screen.queryByText("USD")).toBeNull()

    renderWithWrappers(<MoneyInput onChange={onChange} />)
    expect(screen.queryByText("EUR")).toBeNull()
    // defaults to USD
    expect(screen.getByText("USD")).toBeDefined()
  })
  it("renders an input with the amount pre-filled", () => {
    renderWithWrappers(<MoneyInput initialValues={{ amount: "2000" }} onChange={onChange} />)
    const inputs = screen.UNSAFE_getAllByType(Input)
    expect(inputs).toHaveLength(1)
    expect(inputs[0].props.value).toBe("2,000")
  })

  it("shows custom error message, when error is controlled and amount is invalid", () => {
    renderWithWrappers(
      <MoneyInput
        shouldDisplayLocalError={false}
        error="custom error message"
        onChange={onChange}
      />
    )
    const input = screen.UNSAFE_getAllByType(Input)[0]

    input.props.onChangeText("200---")
    input.parent?.props.validate()
    const texts = screen.UNSAFE_getAllByType(Text)
    expect(texts[1].props["children"]).toBe("custom error message")
  })

  it("shows local error message when parent does not control error and amount is invalid if formatting is not enabled", async () => {
    renderWithWrappers(
      <MoneyInput
        shouldDisplayLocalError
        error="custom error message"
        onChange={onChange}
        format={false}
      />
    )
    const input = screen.UNSAFE_getAllByType(Input)[0]

    await waitFor(() => {
      // if formatting is enabled "200---" will be automatically corrected
      input.props.onChangeText("200---")
      input.parent?.props.validate()
      const texts = screen.UNSAFE_getAllByType(Text)
      expect(texts[1].props["children"]).toBe("Please enter a valid amount.")
    })
  })

  it("calls onChange when the value changes", async () => {
    renderWithWrappers(<MoneyInput onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()

    const input = screen.UNSAFE_getAllByType(Input)[0]
    const select = screen.UNSAFE_getAllByType(SelectModal)[0]

    act(() => {
      input.props.onChangeText("200")
    })
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ amount: "200", currency: "USD" })
    })
    act(() => {
      select.props.onSelectValue("EUR")
    })
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ amount: "200", currency: "EUR" })
    })
  })

  describe("formatMoney", () => {
    it("Correctly formats large and small values", () => {
      const small = "234"
      const large = "26387267387972837962372.93082983"
      expect(formatMoney(small)).toEqual(small)
      expect(formatMoney(large)).toEqual("26,387,267,387,972,837,962,372.93")
    })

    it("Preserves floats to 2 precision", () => {
      expect(formatMoney("2.222")).toEqual("2.22")
    })

    it("Corrects bad formatting", () => {
      const badStr = "3,3,499.-4563,567"
      expect(formatMoney(badStr)).toEqual("33,499.45")
    })
  })

  describe("deformatMoney", () => {
    it("Correctly removes previously applied format", () => {
      const large = "26387267387972837962372.93"
      expect(deformatMoney(formatMoney(large))).toEqual(large)
    })
  })
})
