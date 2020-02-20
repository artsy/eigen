import React from "react"
import * as renderer from "react-test-renderer"

import InvoicePreview from "../InvoicePreview"

import { Theme } from "@artsy/palette"

describe("InvoicePreview", () => {
  it("renders correctly", () => {
    const invoice = {
      state: "REFUNDED" as "REFUNDED",
      payment_url: "https://adopt-cats.org/pay-here",
      total: "$420",
      lewitt_invoice_id: "420",
    }

    const tree = renderer.create(
      <Theme>
        <InvoicePreview invoice={invoice as any} conversationId="420" onSelected={() => null} />
      </Theme>
    )
    expect(tree).toMatchSnapshot()
  })
})
