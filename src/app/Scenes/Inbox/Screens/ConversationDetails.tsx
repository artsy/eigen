import { Flex } from "@artsy/palette-mobile"
import { ConversationDetailsQuery } from "__generated__/ConversationDetailsQuery.graphql"
import { ConversationDetails_me$data } from "__generated__/ConversationDetails_me.graphql"
import { ItemInfoFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/ItemInfo"
import { OrderInformationFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/OrderInformation"
import { PaymentMethodFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/PaymentMethod"
import { AttachmentListFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/AttachmentList"
import { SellerReplyEstimateFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/SellerReplyEstimate"
import { ShippingFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/Shipping"
import { Support } from "app/Scenes/Inbox/Components/Conversations/Support"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"

interface Props {
  me: ConversationDetails_me$data
  relay: RelayProp
}
export const ConversationDetails: React.FC<Props> = ({ me }) => {
  const conversation = me.conversation
  const item = conversation?.items?.[0]?.item

  const order = extractNodes(conversation?.orderConnection)
  const orderItem = order[0]

  return (
    <ScrollView>
      <Flex>
        {!!orderItem && <SellerReplyEstimateFragmentContainer order={orderItem} />}

        {!!item && <ItemInfoFragmentContainer item={item} />}

        {!!item && !!orderItem && (
          <OrderInformationFragmentContainer artwork={item} order={orderItem} />
        )}

        {!!orderItem && (
          <>
            <ShippingFragmentContainer order={orderItem} />
            <PaymentMethodFragmentContainer order={orderItem} />
          </>
        )}

        {!!conversation && <AttachmentListFragmentContainer conversation={conversation} />}

        <Support conversationID={conversation?.internalID ?? ""} />
      </Flex>
    </ScrollView>
  )
}

export const ConversationDetailsFragmentContainer = createFragmentContainer(ConversationDetails, {
  me: graphql`
    fragment ConversationDetails_me on Me {
      conversation(id: $conversationID) {
        ...AttachmentList_conversation
        internalID
        to {
          name
        }
        items {
          item {
            ...ItemInfo_item
            ...OrderInformation_artwork
          }
        }
        orderConnection(
          first: 30
          states: [APPROVED, PENDING, SUBMITTED, FULFILLED, PROCESSING_APPROVAL]
        ) {
          edges {
            node {
              ...SellerReplyEstimate_order
              ...OrderInformation_order
              ...Shipping_order
              ...PaymentMethod_order
            }
          }
        }
      }
    }
  `,
})

export const ConversationDetailsScreenQuery = graphql`
  query ConversationDetailsQuery($conversationID: String!) {
    me {
      ...ConversationDetails_me
    }
  }
`

export const ConversationDetailsQueryRenderer: React.FC<{
  conversationID: string
}> = ({ conversationID }) => {
  return (
    <QueryRenderer<ConversationDetailsQuery>
      environment={getRelayEnvironment()}
      query={ConversationDetailsScreenQuery}
      variables={{
        conversationID,
      }}
      render={renderWithLoadProgress(ConversationDetailsFragmentContainer)}
    />
  )
}
