import * as React from "react"
import "react-native"
import { NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

import { InvoicePreview } from "../InvoicePreview"

beforeAll(() => {
  NativeModules.ARNotificationsManager = { addListener: jest.fn(), remove: jest.fn() }
})

it("renders correctly", () => {
  const tree = renderer.create(<InvoicePreview invoice={invoice} conversationId={"420"} onSelected={() => null} />)
  expect(tree).toMatchSnapshot()
})

const invoice = {
  state: "REFUNDED",
  payment_url: "https://adopt-cats.org/pay-here",
  total: "$420",
  lewitt_invoice_id: "420",
}
