import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { RelayRefetchProp } from "react-relay"
import { InvoicePreview, Props } from "../InvoicePreview"

function createProps(state: Props["invoice"]["state"]): Props {
  return {
    conversationId: "42",
    onSelected: () => "bleep bloop",
    relay: { environment: null, refetch: () => null } as RelayRefetchProp,
    invoice: {
      state,
      lewitt_invoice_id: "42",
      payment_url: "http://example.com/invoice/42",
      total: "$4200.00",
    },
  }
}

storiesOf("Conversations/InvoicePreview")
  .add("Unpaid", () => <InvoicePreview {...createProps("UNPAID")} />)
  .add("Paid", () => <InvoicePreview {...createProps("PAID")} />)
  .add("Void", () => <InvoicePreview {...createProps("VOID")} />)
  .add("Refunded", () => <InvoicePreview {...createProps("REFUNDED")} />)
  .add("Optimistic", () => {
    const props = createProps("UNPAID")
    const notification = { name: "PaymentRequestPaid", url: props.invoice.payment_url }
    return <InvoicePreview {...props} ref={c => c && c.handlePaymentRequestPaidNotification(notification)} />
  })
