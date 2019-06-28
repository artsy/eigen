import { Button } from "@artsy/palette"
import React from "react"
import { EmitterSubscription, Image } from "react-native"
import { createRefetchContainer, graphql } from "react-relay"
import { RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import { NotificationsManager, PaymentRequestPaidNotification } from "lib/NativeModules/NotificationsManager"

import { Schema, Track, track as _track } from "../../../../utils/track"

import { InvoicePreview_invoice } from "__generated__/InvoicePreview_invoice.graphql"

const Container = styled.View`
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  flex-direction: row;
  height: 72;
`

const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-self: center;
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-top: 12;
  margin-left: 12;
  margin-right: 12;
  margin-bottom: 12;
`

const GrayPaymentStatusLabel = styled.Text`
  color: ${colors["gray-medium"]};
  font-family: ${fonts["avant-garde-regular"]};
  text-align: right;
  font-size: 12;
  line-height: 25;
`

const PaidLabel = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  color: ${colors["green-regular"]};
  text-align: right;
  font-size: 12;
  line-height: 25;
`

const PayButtonContainer = styled.View`
  height: 25;
  width: 78;
  align-self: center;
  margin-right: 15;
`

const PaymentRequest = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 14;
`

const CostLabel = styled(PaymentRequest)`
  font-weight: bold;
`

export interface Props {
  invoice: InvoicePreview_invoice
  relay: RelayRefetchProp
  onSelected: () => void
  conversationId: string
  notification?: PaymentRequestPaidNotification
}

interface InvoiceStateButtonProps {
  onSelected: () => void
  invoiceState: Props["invoice"]["state"]
}

const InvoiceStateButton: React.SFC<InvoiceStateButtonProps> = ({ invoiceState, onSelected }) => {
  switch (invoiceState) {
    case "PAID":
      return (
        <PayButtonContainer>
          <PaidLabel>PAID</PaidLabel>
        </PayButtonContainer>
      )
    case "VOID":
      return (
        <PayButtonContainer>
          <GrayPaymentStatusLabel>CANCELED</GrayPaymentStatusLabel>
        </PayButtonContainer>
      )
    case "REFUNDED":
      return (
        <PayButtonContainer>
          <GrayPaymentStatusLabel>REFUNDED</GrayPaymentStatusLabel>
        </PayButtonContainer>
      )
    case "UNPAID":
      return (
        <PayButtonContainer>
          <Button block width="100%" size="small" onPress={onSelected}>
            PAY
          </Button>
        </PayButtonContainer>
      )
  }
}

interface State {
  paid: boolean
}

const track: Track<Props, State> = _track

@track()
export class InvoicePreview extends React.Component<Props, State> {
  public state = { paid: false }
  private subscription?: EmitterSubscription

  componentWillMount() {
    if (this.props.invoice.state === "UNPAID") {
      this.subscription = NotificationsManager.addListener(
        "PaymentRequestPaid",
        this.handlePaymentRequestPaidNotification.bind(this)
      )
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  handlePaymentRequestPaidNotification(notification: PaymentRequestPaidNotification) {
    const { invoice } = this.props
    if (notification.url === invoice.payment_url) {
      // Optimistically update the UI, refetch, then re-render without optimistic update.
      this.setState({ paid: true })
    }
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationAttachmentInvoice,
    owner_type: Schema.OwnerEntityTypes.Invoice,
    owner_id: props.invoice.lewitt_invoice_id,
  }))
  attachmentSelected() {
    this.props.onSelected()
  }

  render() {
    const { invoice } = this.props
    const invoiceState = this.state.paid ? "PAID" : invoice.state

    return (
      <Container>
        <Icon source={require("../../../../../../images/payment_request.png")} />
        <TextContainer>
          <PaymentRequest>Payment request</PaymentRequest>
          <CostLabel>{invoice.total}</CostLabel>
        </TextContainer>
        <InvoiceStateButton invoiceState={invoiceState} onSelected={this.attachmentSelected.bind(this)} />
      </Container>
    )
  }
}

export default createRefetchContainer(
  InvoicePreview,
  {
    invoice: graphql`
      fragment InvoicePreview_invoice on Invoice {
        payment_url
        state
        total
        lewitt_invoice_id
      }
    `,
  },
  graphql`
    query InvoicePreviewRefetchQuery($conversationId: String!, $invoiceId: String!) {
      me {
        invoice(conversationId: $conversationId, invoiceId: $invoiceId) {
          ...InvoicePreview_invoice
        }
      }
    }
  `
)
