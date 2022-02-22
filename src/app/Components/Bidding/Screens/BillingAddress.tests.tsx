import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { FakeNavigator } from "../Helpers/FakeNavigator"
import { BillingAddress } from "./BillingAddress"

import { mockFullAddress } from "../__mocks__/billingAddress"

describe("BillingAddress component", () => {
  const onSubmitMock = jest.fn()
  const fakeNavigator = new FakeNavigator()

  it("renders without throwing an error", () => {
    const billingAddressComponent = renderWithWrappers(
      <BillingAddress onSubmit={onSubmitMock} navigator={fakeNavigator as any} />
    )

    expect(billingAddressComponent).toBeTruthy()
  })

  it("renders 7 inputs and correctly mutates typed values", () => {
    const { getByTestId } = renderWithWrappersTL(
      <BillingAddress onSubmit={onSubmitMock} navigator={fakeNavigator as any} />
    )

    const nameInput = getByTestId("input-full-name")
    const address1Input = getByTestId("input-address-1")
    const address2Input = getByTestId("input-address-2")
    const cityInput = getByTestId("input-city")
    const stateInput = getByTestId("input-state-province-region")
    const postcodeInput = getByTestId("input-post-code")
    const phoneInput = getByTestId("input-phone")

    fireEvent.changeText(nameInput, "mockName")
    fireEvent.changeText(address1Input, "mockAddress1")
    fireEvent.changeText(address2Input, "mockAddress2")
    fireEvent.changeText(cityInput, "mockCity")
    fireEvent.changeText(stateInput, "mockState")
    fireEvent.changeText(postcodeInput, "mockPostcode")
    fireEvent.changeText(phoneInput, "mockPhone")

    expect(nameInput.props.value).toEqual("mockName")
    expect(address1Input.props.value).toEqual("mockAddress1")
    expect(address2Input.props.value).toEqual("mockAddress2")
    expect(cityInput.props.value).toEqual("mockCity")
    expect(stateInput.props.value).toEqual("mockState")
    expect(postcodeInput.props.value).toEqual("mockPostcode")
    expect(phoneInput.props.value).toEqual("mockPhone")
  })

  it("correctly populates relevant inputs with the passed address fields", () => {
    const { getByTestId } = renderWithWrappersTL(
      <BillingAddress
        onSubmit={onSubmitMock}
        billingAddress={mockFullAddress}
        navigator={fakeNavigator as any}
      />
    )

    expect(getByTestId("input-full-name").props.value).toEqual(mockFullAddress.fullName)
    expect(getByTestId("input-address-1").props.value).toEqual(mockFullAddress.addressLine1)
    expect(getByTestId("input-address-2").props.value).toEqual(mockFullAddress.addressLine2)
    expect(getByTestId("input-city").props.value).toEqual(mockFullAddress.city)
    expect(getByTestId("input-state-province-region").props.value).toEqual(mockFullAddress.state)
    expect(getByTestId("input-post-code").props.value).toEqual(mockFullAddress.postalCode)
    expect(getByTestId("input-phone").props.value).toEqual(mockFullAddress.phoneNumber)
  })

  it("fires the passed callback when address is submitted and no required field is missing", () => {
    const { getByTestId } = renderWithWrappersTL(
      <BillingAddress
        onSubmit={onSubmitMock}
        billingAddress={mockFullAddress}
        navigator={fakeNavigator as any}
      />
    )

    getByTestId("button-add").props.onClick()

    expect(onSubmitMock).toHaveBeenCalled()
  })
})
