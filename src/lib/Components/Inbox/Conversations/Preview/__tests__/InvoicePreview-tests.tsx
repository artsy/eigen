import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import InvoicePreview from "../InvoicePreview"

it("renders correctly", () => {
  const tree = renderer.create(<InvoicePreview invoice={invoice} />)
  expect(tree).toMatchSnapshot()
})

const invoice = {
  state: "REFUNDED",
  payment_url: "https://adopt-cats.org/pay-here",
  total: "$420",
}
