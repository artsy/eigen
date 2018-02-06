import React from "react"
import * as renderer from "react-test-renderer"

import InvoicePreview from "../InvoicePreview"

describe("InvoicePreview", () => {
  it("renders correctly", () => {
    const invoice = {
      state: "REFUNDED" as "REFUNDED",
      payment_url: "https://adopt-cats.org/pay-here",
      total: "$420",
      lewitt_invoice_id: "420",
    }

    const tree = renderer.create(<InvoicePreview invoice={invoice} conversationId="420" onSelected={() => null} />)
    expect(tree).toMatchSnapshot()
  })
})
