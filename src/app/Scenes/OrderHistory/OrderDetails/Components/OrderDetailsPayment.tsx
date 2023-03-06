import { InstitutionIcon, CreditCardIcon, CreditCardType, Flex, Text } from "@artsy/palette-mobile"
import { OrderDetailsPayment_order$data } from "__generated__/OrderDetailsPayment_order.graphql"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderDetailsPaymentProps {
  order: OrderDetailsPayment_order$data
}

const PaymentMethodDetails: React.FC<OrderDetailsPaymentProps> = ({
  order: { paymentMethodDetails },
}) => {
  const getPaymentInfo = () => {
    switch (paymentMethodDetails?.__typename) {
      case "BankAccount":
        return (
          <>
            <InstitutionIcon mr={1} width="17" fill="green100" />
            <Text variant="sm" color="black60">
              Bank transfer •••• {paymentMethodDetails.last4}
            </Text>
          </>
        )
      case "WireTransfer":
        return (
          <>
            <InstitutionIcon mr={1} width="17" fill="green100" />
            <Text variant="sm" color="black60">
              Wire transfer
            </Text>
          </>
        )
      case "CreditCard":
        return (
          <>
            <CreditCardIcon type={paymentMethodDetails.brand as CreditCardType} mr={1} width="17" />
            <Text variant="sm" color="black60">
              {paymentMethodDetails.brand} ending in {paymentMethodDetails.lastDigits}
            </Text>
          </>
        )
      default:
        return (
          <Text variant="sm" color="black60">
            N/A
          </Text>
        )
    }
  }

  return (
    <Flex alignItems="center" flexDirection="row">
      {getPaymentInfo()}
    </Flex>
  )
}

export const PaymentMethodSummaryItemFragmentContainer = createFragmentContainer(
  PaymentMethodDetails,
  {
    order: graphql`
      fragment OrderDetailsPayment_order on CommerceOrder {
        paymentMethodDetails {
          __typename
          ... on CreditCard {
            brand
            lastDigits
          }
          ... on BankAccount {
            last4
          }
          ... on WireTransfer {
            isManualPayment
          }
        }
      }
    `,
  }
)
