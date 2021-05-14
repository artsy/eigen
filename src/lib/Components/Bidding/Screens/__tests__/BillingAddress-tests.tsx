import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Sans } from "palette"
import React from "react"
import { TextInput } from "react-native"

import { CountrySelect } from "lib/Components/CountrySelect"
import { Button } from "palette"
import { FakeNavigator } from "../../__tests__/Helpers/FakeNavigator"
import { BillingAddress } from "../BillingAddress"

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const selectCountry = (component, navigator, country) => {
  component.root.findByType(CountrySelect).props.onSelectValue(country.shortName, 5)
}

it("renders without throwing an error", () => {
  renderWithWrappers(<BillingAddress />)
})

it("shows an error message for each field", () => {
  const component = renderWithWrappers(<BillingAddress />)

  component.root.findByType(Button).props.onPress()

  expect(errorTextComponent(component, "Full name").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "Address line 1").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "City").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "State, Province, or Region").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "Postal code").props.children).toEqual("This field is required")
})

it("calls the onSubmit() callback with billing address when ADD BILLING ADDRESS is tapped", () => {
  const fakeNavigator = new FakeNavigator()
  const onSubmitMock = jest.fn()

  const component = renderWithWrappers(<BillingAddress onSubmit={onSubmitMock} navigator={fakeNavigator as any} />)

  textInputComponent(component, "Full name").props.onChangeText("Yuki Stockmeier")
  textInputComponent(component, "Address line 1").props.onChangeText("401 Broadway")
  textInputComponent(component, "Address line 2 (optional)").props.onChangeText("25th floor")
  textInputComponent(component, "City").props.onChangeText("New York")
  textInputComponent(component, "State, Province, or Region").props.onChangeText("NY")
  textInputComponent(component, "Postal code").props.onChangeText("10013")
  textInputComponent(component, "Phone").props.onChangeText("656 333 11111")
  selectCountry(component, fakeNavigator, billingAddress.country)

  component.root.findByType(Button).props.onPress()

  expect(onSubmitMock).toHaveBeenCalledWith(billingAddress)
})

it("updates the validation for country when coming back from the select country screen", () => {
  const fakeNavigator = new FakeNavigator()

  const component = renderWithWrappers(<BillingAddress onSubmit={() => null} navigator={fakeNavigator as any} />)

  textInputComponent(component, "Full name").props.onChangeText("Yuki Stockmeier")
  textInputComponent(component, "Address line 1").props.onChangeText("401 Broadway")
  textInputComponent(component, "Address line 2 (optional)").props.onChangeText("25th floor")
  textInputComponent(component, "City").props.onChangeText("New York")
  textInputComponent(component, "State, Province, or Region").props.onChangeText("NY")
  textInputComponent(component, "Postal code").props.onChangeText("10013")
  textInputComponent(component, "Phone").props.onChangeText("656 333 11111")

  component.root.findByType(Button).props.onPress()

  expect(component.root.findAllByType(Sans)[1].props.children).toEqual("This field is required")

  selectCountry(component, fakeNavigator, billingAddress.country)

  // The <Sans12> instances in the BillingAddress screen display error messages
  expect(component.root.findAllByType(Sans).length).toEqual(2)
})

it("pre-fills the fields if initial billing address is provided", () => {
  const component = renderWithWrappers(<BillingAddress billingAddress={billingAddress} />)

  expect(textInputComponent(component, "Full name").props.value).toEqual("Yuki Stockmeier")
  expect(textInputComponent(component, "Address line 1").props.value).toEqual("401 Broadway")
  expect(textInputComponent(component, "Address line 2 (optional)").props.value).toEqual("25th floor")
  expect(textInputComponent(component, "City").props.value).toEqual("New York")
  expect(textInputComponent(component, "State, Province, or Region").props.value).toEqual("NY")
  expect(textInputComponent(component, "Postal code").props.value).toEqual("10013")

  const countryField = component.root.findAllByType(Sans)[0]
  expect(countryField.props.children).toEqual("United States")
})

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const errorTextComponent = (component, label) => findFieldForInput(component, { label }).findByType(Sans)

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const textInputComponent = (component, label) => findFieldForInput(component, { label }).findByType(TextInput)

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const findFieldForInput = (component, { label }) => component.root.findByProps({ label })

const billingAddress = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
  country: {
    longName: "United States",
    shortName: "US",
  },
  phoneNumber: "656 333 11111",
}
