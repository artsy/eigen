import { ConversationDetails_me$data } from "__generated__/ConversationDetails_me.graphql"
import { ConversationDetailsQuery } from "__generated__/ConversationDetailsQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { ItemInfoFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/ItemInfo"
import { AttachmentListFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/AttachmentList"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { track as _track } from "app/utils/track"
import { Flex } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { OrderInformationFragmentContainer } from "../Components/Conversations/OrderInformation"
import { PaymentMethodFragmentContainer } from "../Components/Conversations/PaymentMethod"
import { SellerReplyEstimateFragmentContainer } from "../Components/Conversations/SellerReplyEstimate"
import { ShippingFragmentContainer } from "../Components/Conversations/Shipping"
import { Support } from "../Components/Conversations/Support"

interface Props {
  me: ConversationDetails_me$data
  relay: RelayProp
}
export const ConversationDetails: React.FC<Props> = ({ me }) => {
  const conversation = me.conversation
  const partnerName = conversation?.to.name
  const item = conversation?.items?.[0]?.item

  const order = extractNodes(conversation?.orderConnection)
  const orderItem = order[0]

  return (
    <PageWithSimpleHeader title={partnerName ?? ""}>
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

          <Support />
        </Flex>
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

export const ConversationDetailsFragmentContainer = createFragmentContainer(ConversationDetails, {
  me: graphql`
    fragment ConversationDetails_me on Me {
      conversation(id: $conversationID) {
        ...AttachmentList_conversation
        to {
          name
        }
        items {
          item {
            ...ItemInfo_item
            ...OrderInformation_artwork
          }
        }
        orderConnection(first: 30, states: [APPROVED, PENDING, SUBMITTED, FULFILLED]) {
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

export const ConversationDetailsQueryRenderer: React.FC<{
  conversationID: string
}> = ({ conversationID }) => {
  return (
    <QueryRenderer<ConversationDetailsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ConversationDetailsQuery($conversationID: String!) {
          me {
            ...ConversationDetails_me
          }
        }
      `}
      variables={{
        conversationID,
      }}
      render={renderWithLoadProgress(ConversationDetailsFragmentContainer)}
    />
  )
}
