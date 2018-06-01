import React from "react"
import { TextInput } from "react-native"
import * as renderer from "react-test-renderer"

import { Button } from "../../Components/Button"
import { Sans12 } from "../../Elements/Typography"
import { BillingAddress } from "../BillingAddress"

it("renders properly", () => {
  const component = renderer.create(<BillingAddress />).toJSON()
  expect(component).toMatchSnapshot()
})

it("shows an error message for each field", () => {
  const component = renderer.create(<BillingAddress />)

  component.root.findByType(Button).instance.props.onPress()

  expect(errorTextComponent(component, "Full name").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "Address line 1").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "City").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "State, Province, or Region").props.children).toEqual("This field is required")
  expect(errorTextComponent(component, "Postal code").props.children).toEqual("This field is required")
})

it("calls the onSubmit() callback with billing address when ADD BILLING ADDRESS is tapped", () => {
  const onSubmitMock = jest.fn()
  const component = renderer.create(<BillingAddress onSubmit={onSubmitMock} navigator={{ pop: () => null } as any} />)

  textInputComponent(component, "Full name").props.onChangeText("Yuki Stockmeier")
  textInputComponent(component, "Address line 1").props.onChangeText("401 Broadway")
  textInputComponent(component, "Address line 2 (optional)").props.onChangeText("25th floor")
  textInputComponent(component, "City").props.onChangeText("New York")
  textInputComponent(component, "State, Province, or Region").props.onChangeText("NY")
  textInputComponent(component, "Postal code").props.onChangeText("10013")
  component.root.findByType(Button).instance.props.onPress()

  expect(onSubmitMock).toHaveBeenCalledWith(billingAddress)
})

it("pre-fills the fields if initial billing address is provided", () => {
  const component = renderer.create(<BillingAddress billingAddress={billingAddress} />)

  expect(textInputComponent(component, "Full name").props.value).toEqual("Yuki Stockmeier")
  expect(textInputComponent(component, "Address line 1").props.value).toEqual("401 Broadway")
  expect(textInputComponent(component, "Address line 2 (optional)").props.value).toEqual("25th floor")
  expect(textInputComponent(component, "City").props.value).toEqual("New York")
  expect(textInputComponent(component, "State, Province, or Region").props.value).toEqual("NY")
  expect(textInputComponent(component, "Postal code").props.value).toEqual("10013")
})

const errorTextComponent = (component, label) => findFieldForInput(component, { label }).findByType(Sans12)

const textInputComponent = (component, label) => findFieldForInput(component, { label }).findByType(TextInput)

const findFieldForInput = (component, { label }) => component.root.findByProps({ label })

const billingAddress = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
}
