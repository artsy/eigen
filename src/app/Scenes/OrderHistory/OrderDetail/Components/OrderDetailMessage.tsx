import { Box } from "@artsy/palette-mobile"
import { OrderDetailMessage_order$key } from "__generated__/OrderDetailMessage_order.graphql"
import { getMessageContent } from "app/Scenes/OrderHistory/OrderDetail/utils/getMessageContent"
import { graphql, useFragment } from "react-relay"

interface OrderDetailMessageProps {
  order: OrderDetailMessage_order$key
}

export const OrderDetailMessage: React.FC<OrderDetailMessageProps> = ({ order }) => {
  const orderData = useFragment(orderDetailMessageFragment, order)

  if (!orderData) {
    return null
  }

  return <Box>{getMessageContent(orderData)}</Box>
}

const orderDetailMessageFragment = graphql`
  fragment OrderDetailMessage_order on Order {
    buyerStateExpiresAt
    code
    currencyCode
    internalID
    displayTexts {
      messageType
    }
    deliveryInfo {
      shipperName
      trackingNumber
      trackingURL
      estimatedDelivery
      estimatedDeliveryWindow
    }
  }
`
