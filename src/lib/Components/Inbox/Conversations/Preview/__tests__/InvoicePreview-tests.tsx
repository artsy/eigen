import * as React from "react"
import * as renderer from "react-test-renderer"

import { InvoicePreview, Props } from "../InvoicePreview"

describe("InvoicePreview", () => {
  it("renders correctly", () => {
    const props: Props = {
      conversationId: "420",
      onSelected: () => null,
      invoice: {
        state: "REFUNDED",
        payment_url: "https://adopt-cats.org/pay-here",
        total: "$420",
        lewitt_invoice_id: "420",
      },
    }

    const tree = renderer.create(<InvoicePreview {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
