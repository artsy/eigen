import { MessageIcon } from "@artsy/icons/native"
import { Box, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { OrderDetailHelpLinks_order$key } from "__generated__/OrderDetailHelpLinks_order.graphql"
import { useOrderDetailTracking } from "app/Scenes/OrderHistory/OrderDetail/hooks/useOrderDetailTracking"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

const HELP_CENTER_LINK = "https://support.artsy.net/s/topic/0TO3b000000UessGAC/buy"

interface OrderDetailHelpLinksProps {
  order: OrderDetailHelpLinks_order$key
}

export const OrderDetailHelpLinks: React.FC<OrderDetailHelpLinksProps> = ({ order }) => {
  const orderData = useFragment(fragment, order)
  const orderDetailTracks = useOrderDetailTracking()

  return (
    <Box backgroundColor="mono5" p={2}>
      <Flex flexDirection="row" alignItems="flex-start">
        <MessageIcon fill="mono100" mt={0.5} />

        <Spacer x={0.5} />

        <Flex>
          <Text variant="sm" fontWeight="bold">
            Need help?
          </Text>

          <Text variant="xs" color="mono60">
            <LinkText
              onPress={() => {
                orderDetailTracks.clickedVisitHelpCenter(orderData.internalID, orderData.mode)
                navigate(HELP_CENTER_LINK)
              }}
              variant="xs"
              color="mono60"
            >
              Visit our help center
            </LinkText>
            .
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

const fragment = graphql`
  fragment OrderDetailHelpLinks_order on Order {
    internalID
    mode
  }
`
