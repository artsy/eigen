import { waitFor } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Input, Text } from "palette"
import { Select } from "palette/elements/Select"
import { act } from "react-test-renderer"
import { MoneyInput } from "./MoneyInput"

describe("MoneyInput", () => {
  let onChange = jest.fn()

  beforeEach(() => {
    onChange = jest.fn()
  })

  it("provides a Select for Currency", () => {
    const wrapperWithInitialCurrency = renderWithWrappers(
      <MoneyInput initialValues={{ currency: "EUR" }} onChange={onChange} />
    )
    expect(wrapperWithInitialCurrency.UNSAFE_getAllByType(Select)).toHaveLength(1)
    expect(wrapperWithInitialCurrency.queryByText("EUR €")).toBeDefined()
    expect(wrapperWithInitialCurrency.queryByText("USD $")).toBeNull()

    const wrapperWithoutInitialCurrency = renderWithWrappers(<MoneyInput onChange={onChange} />)
    expect(wrapperWithoutInitialCurrency.queryByText("EUR €")).toBeNull()
    // defaults to USD
    expect(wrapperWithoutInitialCurrency.queryByText("USD $")).toBeDefined()
  })

  it("renders an input with the amount pre-filled", () => {
    const wrapper = renderWithWrappers(
      <MoneyInput initialValues={{ amount: "2000" }} onChange={onChange} />
    )
    const inputs = wrapper.UNSAFE_getAllByType(Input)
    expect(inputs).toHaveLength(1)
    expect(inputs[0].props.value).toBe("2000")
  })

  it("shows custom error message, when error is controlled and amount is invalid", () => {
    const wrapper = renderWithWrappers(
      <MoneyInput
        shouldDisplayLocalError={false}
        error="custom error message"
        onChange={onChange}
      />
    )
    const input = wrapper.UNSAFE_getAllByType(Input)[0]

    input.props.onChangeText("200---")
    input.parent?.props.validate()
    expect(wrapper.UNSAFE_getAllByType(Text)[1].props.children).toBe("custom error message")
  })

  it("shows local error message when parent does not control error and amount is invalid", async () => {
    const wrapper = renderWithWrappers(
      <MoneyInput shouldDisplayLocalError error="custom error message" onChange={onChange} />
    )
    const input = wrapper.UNSAFE_getAllByType(Input)[0]

    input.props.onChangeText("200---")
    input.parent?.props.validate()
    expect(wrapper.UNSAFE_getAllByType(Text)[1].props.children).toBe("Please enter a valid amount.")
  })

  it("calls onChange when the value changes", async () => {
    const wrapper = renderWithWrappers(<MoneyInput onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()

    const input = wrapper.UNSAFE_getAllByType(Input)[0]
    const select = wrapper.UNSAFE_getAllByType(Select)[0]

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
})
