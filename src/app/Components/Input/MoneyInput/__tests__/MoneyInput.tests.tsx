import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MoneyInput } from "app/Components/Input/MoneyInput/MoneyInput"
import { deformatMoney, formatMoney } from "app/Components/Input/MoneyInput/moneyInputHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MoneyInput", () => {
  let onChange = jest.fn()

  beforeEach(() => {
    onChange = jest.fn()
  })

  it("provides a Select for Currency", async () => {
    await renderWithWrappers(<MoneyInput initialValues={{ currency: "EUR" }} onChange={onChange} />)
    expect(screen.getAllByRole("button", { name: "EUR" })).toHaveLength(1)
    expect(screen.getByText("EUR")).toBeDefined()
    expect(screen.queryByText("USD")).toBeNull()

    await renderWithWrappers(<MoneyInput onChange={onChange} />)
    expect(screen.queryByText("EUR")).toBeNull()
    // defaults to USD
    expect(screen.getByText("USD")).toBeDefined()
  })
  it("shows a fixed currency as a unit instead of a picker", async () => {
    await renderWithWrappers(<MoneyInput currency="USD" unit="US$" onChange={onChange} />)

    expect(screen.getByText("US$")).toBeOnTheScreen()
    expect(screen.queryByRole("button", { name: "USD" })).not.toBeOnTheScreen()
  })

  it("drops cents when they aren't allowed", async () => {
    await renderWithWrappers(
      <MoneyInput testID="money-input" allowCents={false} onChange={onChange} />
    )
    const input = screen.getByTestId("money-input")

    await fireEvent.changeText(input, "3,200.50")

    expect(screen.getByTestId("money-input")).toHaveProp("keyboardType", "number-pad")
    expect(screen.getByTestId("money-input")).toHaveDisplayValue("3,200")
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({ currency: "USD", amount: "3200" })
    )
  })

  it("accepts amounts that already show a thousands separator", async () => {
    await renderWithWrappers(<MoneyInput testID="money-input" onChange={onChange} />)

    await fireEvent.changeText(screen.getByTestId("money-input"), "3,200")
    await fireEvent.changeText(screen.getByTestId("money-input"), "3,2000")

    expect(screen.getByTestId("money-input")).toHaveDisplayValue("32,000")
    expect(screen.queryByText("Please enter a valid amount.")).not.toBeOnTheScreen()
  })

  it("renders an input with the amount pre-filled", async () => {
    await renderWithWrappers(
      <MoneyInput testID="money-input" initialValues={{ amount: "2000" }} onChange={onChange} />
    )
    expect(screen.getAllByTestId("money-input")).toHaveLength(1)
    expect(screen.getByTestId("money-input")).toHaveDisplayValue("2,000")
  })

  it("shows custom error message, when error is controlled and amount is invalid", async () => {
    await renderWithWrappers(
      <MoneyInput
        testID="money-input"
        shouldDisplayLocalError={false}
        error="custom error message"
        onChange={onChange}
      />
    )

    // changing the text triggers validation
    await fireEvent.changeText(screen.getByTestId("money-input"), "200---")

    expect(screen.getByText("custom error message")).toBeOnTheScreen()
    expect(screen.queryByText("Please enter a valid amount.")).not.toBeOnTheScreen()
  })

  it("shows local error message when parent does not control error and amount is invalid if formatting is not enabled", async () => {
    await renderWithWrappers(
      <MoneyInput
        testID="money-input"
        shouldDisplayLocalError
        error="custom error message"
        onChange={onChange}
        format={false}
      />
    )

    // if formatting is enabled "200---" will be automatically corrected
    // changing the text triggers validation
    await fireEvent.changeText(screen.getByTestId("money-input"), "200---")

    expect(await screen.findByText("Please enter a valid amount.")).toBeOnTheScreen()
    expect(screen.queryByText("custom error message")).not.toBeOnTheScreen()
  })

  it("calls onChange when the value changes", async () => {
    await renderWithWrappers(<MoneyInput testID="money-input" onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()

    await fireEvent.changeText(screen.getByTestId("money-input"), "200")
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ amount: "200", currency: "USD" })
    })

    await fireEvent.press(screen.getByRole("button", { name: "USD" }))
    await fireEvent.press(screen.getByText("EUR €"))
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
