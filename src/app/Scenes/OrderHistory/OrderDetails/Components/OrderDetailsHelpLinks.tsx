import { MessageIcon } from "@artsy/icons/native"
import { Box, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { OrderDetailsHelpLinks_me$key } from "__generated__/OrderDetailsHelpLinks_me.graphql"
import { OrderDetailsHelpLinks_order$key } from "__generated__/OrderDetailsHelpLinks_order.graphql"
import { OrderDetailsAskSpecialistModal } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsAskSpecialistModal"
import { useOrderDetailsTracking } from "app/Scenes/OrderHistory/OrderDetails/hooks/useOrderDetailsTracking"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

const HELP_CENTER_LINK = "https://support.artsy.net/s/topic/0TO3b000000UessGAC/buy"

interface OrderDetailsHelpLinksProps {
  order: OrderDetailsHelpLinks_order$key
  me: OrderDetailsHelpLinks_me$key
}

export const OrderDetailsHelpLinks: React.FC<OrderDetailsHelpLinksProps> = ({ order, me }) => {
  const [isVisible, setVisible] = useState(false)
  const orderData = useFragment(orderFragment, order)
  const meData = useFragment(meFragment, me)
  const orderDetailTracks = useOrderDetailsTracking()

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

      <OrderDetailsAskSpecialistModal
        visible={isVisible}
        handleDismiss={() => setVisible(false)}
        me={meData}
        order={orderData}
      />
    </Box>
  )
}

const orderFragment = graphql`
  fragment OrderDetailsHelpLinks_order on Order {
    internalID
    mode
    source
    ...OrderDetailsAskSpecialistModal_order
  }
`
const meFragment = graphql`
  fragment OrderDetailsHelpLinks_me on Me {
    ...OrderDetailsAskSpecialistModal_me
  }
`
