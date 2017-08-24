import * as React from "react"
import { Image, Text, TouchableHighlight } from "react-native"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"

import SerifText from "../../../Text/Serif"

import InvertedButton from "../../../Buttons/InvertedButton"

import AttachmentPreview, { AttachmentProps } from "../Preview/Attachment/AttachmentPreview"

const Container = styled.View`
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  flex: 1;
  flex-direction: row;
`

const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 25;
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
const PaidLabel = styled.Text`color: ${colors["green-regular"]};`
const PayButtonContainer = styled.View`
  height: 25;
  width: 71;
`

const PaymentRequest = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 14;
`

interface Props extends AttachmentProps, RelayProps {}

interface InvoiceStateButtonProps {
  state: string | null
}

const InvoiceStateButton: React.SFC<InvoiceStateButtonProps> = ({ state }) => {
  if (state === "PAID") {
    return <PaidLabel>PAID</PaidLabel>
  }
  if (state === "VOID") {
    return <CanceledLabel>CANCELED</CanceledLabel>
  }
  if (state === "REFUNDED") {
    return <RefundedLabel>REFUNDED</RefundedLabel>
  }
  if (state === "UNPAID") {
    return (
      <PayButtonContainer>
        <InvertedButton text="PAY" />
      </PayButtonContainer>
    )
  }
}

export const InvoicePreview: React.SFC<Props> = ({ invoice, onSelected }) =>
  <AttachmentPreview attachment={invoice as any} onSelected={onSelected}>
    <Container>
      <Icon source={require("../../../../../../images/payment_request.png")} />
      <TextContainer>
        <PaymentRequest>Payment request</PaymentRequest>
        <PaymentRequest>
          {invoice.total}
        </PaymentRequest>
      </TextContainer>
      <TextContainer>
        {InvoiceStateButton(invoice)}
      </TextContainer>
    </Container>
  </AttachmentPreview>

export default Relay.createContainer(InvoicePreview, {
  fragments: {
    invoice: () => Relay.QL`
      fragment on Invoice {
        payment_url
        state
        total
      }
    `,
  },
})

interface RelayProps {
  invoice: {
    payment_url: string | null
    state: string | null
    total: string | null
  }
}
