import { ApplePayMarkIcon, GooglePayIcon, HomeIcon, IconProps } from "@artsy/icons/native"
import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import {
  OrderDetailsPaymentInfo_order$data,
  OrderDetailsPaymentInfo_order$key,
} from "__generated__/OrderDetailsPaymentInfo_order.graphql"
import { BrandCreditCardIcon } from "app/Components/BrandCreditCardIcon/BrandCreditCardIcon"
import { DateTime } from "luxon"
import { graphql, useFragment } from "react-relay"

interface OrderDetailsPaymentInfoProps {
  order: OrderDetailsPaymentInfo_order$key
}

export const OrderDetailsPaymentInfo: React.FC<OrderDetailsPaymentInfoProps> = ({ order }) => {
  const orderData = useFragment(fragment, order)

  const { Icon, text } = getPaymentMethodContent(orderData)

  if (!Icon) {
    return null
  }

  return (
    <Box px={2}>
      <Text variant="sm" fontWeight="bold">
        Payment method
      </Text>

      <Spacer y={0.5} />

      <Flex flexDirection="row" alignItems="center">
        <Icon mr={1} />

        <Text variant="xs">{text}</Text>
      </Flex>
    </Box>
  )
}

const getPaymentMethodContent = (order: NonNullable<OrderDetailsPaymentInfo_order$data>) => {
  const { creditCardWalletType, paymentMethodDetails } = order

  if (creditCardWalletType) {
    switch (creditCardWalletType) {
      case "APPLE_PAY":
        return { Icon: ApplePayMarkIcon, text: "Apple Pay" }
      case "GOOGLE_PAY":
        return { Icon: GooglePayIcon, text: "Google Pay" }
      default:
        return { Icon: null }
    }
  }

  switch (paymentMethodDetails?.__typename) {
    case "CreditCard": {
      const { brand, expirationMonth, expirationYear, lastDigits } = paymentMethodDetails

      const formattedExpDate = DateTime.fromObject({
        year: expirationYear,
        month: expirationMonth,
      }).toFormat("MM/yy")

      return {
        Icon: (props: IconProps) => <BrandCreditCardIcon type={brand} {...props} />,
        text: `•••• ${lastDigits}  Exp ${formattedExpDate}`,
      }
    }

    case "BankAccount":
      return { Icon: HomeIcon, text: `Bank transfer •••• ${paymentMethodDetails.last4}` }

    case "WireTransfer":
      return { Icon: HomeIcon, text: "Wire transfer" }

    default:
      return { Icon: null }
  }
}

const fragment = graphql`
  fragment OrderDetailsPaymentInfo_order on Order {
    creditCardWalletType
    paymentMethodDetails {
      __typename
      ... on CreditCard {
        brand
        lastDigits
        expirationYear
        expirationMonth
      }
      ... on BankAccount {
        last4
      }
      ... on WireTransfer {
        isManualPayment
      }
    }
  }
`
