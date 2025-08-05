import { MessageIcon } from "@artsy/icons/native"
import { Box, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { OrderDetailHelpLinks_me$key } from "__generated__/OrderDetailHelpLinks_me.graphql"
import { OrderDetailHelpLinks_order$key } from "__generated__/OrderDetailHelpLinks_order.graphql"
import { OrderDetailAskSpecialistModal } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailAskSpecialistModal"
import { useOrderDetailTracking } from "app/Scenes/OrderHistory/OrderDetail/hooks/useOrderDetailTracking"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

const HELP_CENTER_LINK = "https://support.artsy.net/s/topic/0TO3b000000UessGAC/buy"

interface OrderDetailHelpLinksProps {
  order: OrderDetailHelpLinks_order$key
  me: OrderDetailHelpLinks_me$key
}

export const OrderDetailHelpLinks: React.FC<OrderDetailHelpLinksProps> = ({ order, me }) => {
  const [isVisible, setVisible] = useState(false)
  const orderData = useFragment(orderFragment, order)
  const meData = useFragment(meFragment, me)
  const orderDetailTracks = useOrderDetailTracking()

  const { internalID, mode, source } = orderData

  const onHelpCenterPress = () => {
    orderDetailTracks.tappedVisitHelpCenter(internalID, mode, source)
    navigate(HELP_CENTER_LINK)
  }

  const onAskSpecialistPress = () => {
    orderDetailTracks.tappedAskSpecialist(internalID, mode, source)
    setVisible(true)
  }

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
            <LinkText onPress={onHelpCenterPress} variant="xs" color="mono60">
              Visit our help center
            </LinkText>
            {" or "}
            <LinkText onPress={onAskSpecialistPress} variant="xs" color="mono60">
              ask a question
            </LinkText>
            .
          </Text>
        </Flex>
      </Flex>

      <OrderDetailAskSpecialistModal
        visible={isVisible}
        handleDismiss={() => setVisible(false)}
        me={meData}
        order={orderData}
      />
    </Box>
  )
}

const orderFragment = graphql`
  fragment OrderDetailHelpLinks_order on Order {
    internalID
    mode
    source
    ...OrderDetailAskSpecialistModal_order
  }
`
const meFragment = graphql`
  fragment OrderDetailHelpLinks_me on Me {
    ...OrderDetailAskSpecialistModal_me
  }
`
