import * as React from "react"
import { Image, TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

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
}

interface InvoiceStateButtonProps {
  state: string | null
}

const InvoiceStateButton: React.SFC<InvoiceStateButtonProps> = ({ state }) => {
  switch (state) {
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

export const InvoicePreview: React.SFC<Props> = ({ invoice, onSelected }) =>
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
        <InvoiceStateButton state={invoice.state} />
      </TextContainer>
    </Container>
  </TouchableHighlight>

export default createFragmentContainer(
  InvoicePreview,
  graphql`
    fragment InvoicePreview_invoice on Invoice {
      payment_url
      state
      total
    }
  `
)

interface RelayProps {
  invoice: {
    payment_url: string | null
    state: string | null
    total: string | null
  }
}
