import { ShieldIcon } from "@artsy/icons/native"
import { Flex, LinkText, Message, Text } from "@artsy/palette-mobile"
import { OrderDetailBuyerProtection_order$key } from "__generated__/OrderDetailBuyerProtection_order.graphql"
import { useOrderDetailTracking } from "app/Scenes/OrderHistory/OrderDetail/hooks/useOrderDetailTracking"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

const BUYER_GUARANTEE_LINK = "https://support.artsy.net/s/article/The-Artsy-Guarantee"

interface OrderDetailBuyerProtectionProps {
  order: OrderDetailBuyerProtection_order$key
}

export const OrderDetailBuyerProtection: React.FC<OrderDetailBuyerProtectionProps> = ({
  order,
}) => {
  const orderData = useFragment(fragment, order)
  const orderDetailTracks = useOrderDetailTracking()

  return (
    <Message variant="default" containerStyle={{ px: 1 }}>
      <Flex flexDirection="row" alignItems="flex-start">
        <ShieldIcon fill="mono100" mr={0.5} mt="2px" />

        <Flex flex={1}>
          <Text variant="xs">
            Your purchase is protected with{" "}
            <LinkText
              onPress={() => {
                orderDetailTracks.tappedBuyerProtection(orderData.internalID)
                navigate(BUYER_GUARANTEE_LINK)
              }}
              variant="xs"
            >
              Artsy’s buyer protection
            </LinkText>
            .
          </Text>
        </Flex>
      </Flex>
    </Message>
  )
}

const fragment = graphql`
  fragment OrderDetailBuyerProtection_order on Order {
    internalID
  }
`
