import { Box } from "@artsy/palette-mobile"
import { OrderDetailsMessage_order$key } from "__generated__/OrderDetailsMessage_order.graphql"
import { MessageDetails } from "app/Scenes/OrderHistory/OrderDetails/Components/MessageDetails"
import { graphql, useFragment } from "react-relay"

interface OrderDetailsMessageProps {
  order: OrderDetailsMessage_order$key
}

export const OrderDetailsMessage: React.FC<OrderDetailsMessageProps> = ({ order }) => {
  const orderData = useFragment(orderDetailsMessageFragment, order)

  if (!orderData) {
    return null
  }

  return (
    <Box py={2}>
      <MessageDetails order={orderData} />
    </Box>
  )
}

const orderDetailsMessageFragment = graphql`
  fragment OrderDetailsMessage_order on Order {
    buyerStateExpiresAt
    code
    currencyCode
    internalID
    impulseConversationId
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
