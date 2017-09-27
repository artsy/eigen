import * as React from "react"
import { Image, TouchableHighlight } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import { EmitterSubscription, NativeEventEmitter, NativeModules } from "react-native"

import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"
import InvertedButton from "../../../Buttons/InvertedButton"

const Container = styled.View`
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  flex-direction: row;
  height: 72;
`

const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 10;
  align-self: center;
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-top: 12;
  margin-left: 12;
  margin-bottom: 12;
`

const CanceledLabel = styled.Text`
  color: ${colors["gray-medium"]};
  font-weight: bold;
`

const RefundedLabel = styled.Text`
  color: ${colors["gray-medium"]};
  font-weight: bold;
`

const PaidLabel = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  color: ${colors["green-regular"]};
  text-align: right;
  font-size: 12;
  line-height: 25;
`

const PayButtonContainer = styled.View`
  margin-left: 15;
  height: 25;
  width: 71;
`

const PaymentRequest = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 14;
`

const CostLabel = styled(PaymentRequest)`
  font-weight: bold;
`

interface Props extends RelayProps {
  onSelected: () => void
  conversationId: string
  relay?: RelayRefetchProp
}

interface InvoiceStateButtonProps {
  invoiceState: string | null
  isOptimisticUpdate: boolean
}

const InvoiceStateButton: React.SFC<InvoiceStateButtonProps> = ({ invoiceState, isOptimisticUpdate }) => {
  if (isOptimisticUpdate) {
    return (
      <PayButtonContainer>
        <PaidLabel>PAID</PaidLabel>
      </PayButtonContainer>
    )
  }
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
          <CanceledLabel>CANCELED</CanceledLabel>
        </PayButtonContainer>
      )
    case "REFUNDED":
      return (
        <PayButtonContainer>
          <RefundedLabel>REFUNDED</RefundedLabel>
        </PayButtonContainer>
      )
    case "UNPAID":
      return (
        <PayButtonContainer>
          <InvertedButton text="PAY" />
        </PayButtonContainer>
      )
  }
}

interface State {
  hasReceivedNotification: boolean
  subscription: EmitterSubscription
}

export class InvoicePreview extends React.Component<Props, State> {
  componentWillMount() {
    const { conversationId, relay, invoice } = this.props
    const { ARNotificationsManager } = NativeModules
    const notificationsManagerEmitter = new NativeEventEmitter(ARNotificationsManager)
    const paymentRequestPaidCallback = notification => {
      if (notification.url === invoice.payment_url) {
        // Optimistically update the UI, but also refetch.
        this.setState({
          hasReceivedNotification: true,
        })
        relay.refetch({ conversationId, invoiceId: invoice.lewitt_invoice_id }, null, null, { force: true })
      }
    }
    const subscription = notificationsManagerEmitter.addListener("PaymentRequestPaid", paymentRequestPaidCallback)

    this.setState({
      subscription,
    })
  }

  componentWillUnmount() {
    if (this.state.subscription) {
      this.state.subscription.remove()
    }
  }

  render() {
    const { invoice, onSelected } = this.props

    return (
      <TouchableHighlight onPress={invoice.state === "UNPAID" ? onSelected : null} underlayColor={colors["gray-light"]}>
        <Container>
          <Icon source={require("../../../../../../images/payment_request.png")} />
          <TextContainer>
            <PaymentRequest>Payment request</PaymentRequest>
            <CostLabel>
              {invoice.total}
            </CostLabel>
          </TextContainer>
          <TextContainer>
            <InvoiceStateButton invoiceState={invoice.state} isOptimisticUpdate={this.state.hasReceivedNotification} />
          </TextContainer>
        </Container>
      </TouchableHighlight>
    )
  }
}

export default createRefetchContainer(
  InvoicePreview,
  graphql`
    fragment InvoicePreview_invoice on Invoice {
      payment_url
      state
      total
      lewitt_invoice_id
    }
  `,
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

interface RelayProps {
  invoice: {
    payment_url: string | null
    state: string | null
    total: string | null
    lewitt_invoice_id: string
  }
}
