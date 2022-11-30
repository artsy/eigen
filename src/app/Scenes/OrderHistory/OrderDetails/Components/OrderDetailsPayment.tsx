import { OrderDetailsPayment_order$data } from "__generated__/OrderDetailsPayment_order.graphql"
import { CreditCardIcon, Flex, InstitutionIcon, Text } from "palette"
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
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <InstitutionIcon mr={1} width="17" fill="green100" />
            <Text variant="sm" color="black60">
              Bank transfer •••• {paymentMethodDetails.last4}
            </Text>
          </Flex>
        )
      case "WireTransfer":
        return (
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <InstitutionIcon mr={1} width="17" fill="green100" />
            <Text variant="sm" color="black60">
              Wire transfer
            </Text>
          </Flex>
        )
      case "CreditCard":
        return (
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <CreditCardIcon type={paymentMethodDetails.brand as any} mr={1} width="17" />
            <Text variant="sm" color="black60">
              {paymentMethodDetails?.brand} ending in {paymentMethodDetails?.lastDigits}
            </Text>
          </Flex>
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
