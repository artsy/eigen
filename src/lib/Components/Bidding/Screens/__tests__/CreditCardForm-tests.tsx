import React from "react"
import * as renderer from "react-test-renderer"

import { Button } from "../../Components/Button"
import { CreditCardForm } from "../CreditCardForm"

jest.mock("tipsi-stripe", () => ({ PaymentCardTextField: () => "PaymentCardTextField" }))

const onSubmitMock = jest.fn()

it("renders properly", () => {
  const component = renderer.create(<CreditCardForm onSubmit={onSubmitMock} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("calls the onSubmit() callback with valid credit card when ADD CREDIT CARD is tapped", () => {
  const component = renderer.create(<CreditCardForm onSubmit={onSubmitMock} navigator={{ pop: () => null } as any} />)

  component.root.instance.setState({ valid: true, params: creditCard })
  component.root.findByType(Button).instance.props.onPress()

  expect(onSubmitMock).toHaveBeenCalledWith(creditCard)
})

const creditCard = {
  number: "4242424242424242",
  expMonth: "04",
  expYear: "20",
  cvc: "314",
}
