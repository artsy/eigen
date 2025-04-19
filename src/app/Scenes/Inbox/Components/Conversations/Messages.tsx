import { ShieldIcon } from "@artsy/palette-mobile"
import { Messages_conversation$data } from "__generated__/Messages_conversation.graphql"
import { ToastComponent } from "app/Components/Toast/ToastComponent"
import { PAGE_SIZE } from "app/Components/constants"

import { extractNodes } from "app/utils/extractNodes"

import { sortBy } from "lodash"
import { DateTime } from "luxon"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { MessageGroup } from "./MessageGroup"
import { ConversationItem, groupConversationItems } from "./utils/groupConversationItems"

interface Props {
  conversation: Messages_conversation$data
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
  onRefresh?: () => void
}

const LoadingIndicator = styled.ActivityIndicator`
  margin-top: 40px;
`

type Order = NonNullable<
  NonNullable<
    NonNullable<NonNullable<Props["conversation"]["orderConnection"]>["edges"]>[number]
  >["node"]
>
type OrderEvent = Order["orderHistory"][number]
type OrderEventWithKey = OrderEvent & { key: string }

export const Messages: React.FC<Props> = forwardRef((props, ref) => {
  const { conversation, relay, onDataFetching, onRefresh } = props

  const [fetchingMoreData, setFetchingMoreData] = useState(false)
  const [reloadingData, setReloadingData] = useState(false)
  const [messages, setMessages] = useState<ConversationItem[][]>([])

  // Get all messages and give them a key for use with flatlist
  const allMessages = extractNodes(conversation.messagesConnection)
    .filter((node) => {
      if (node.isFirstMessage) {
        return true
      }
      return node.body?.length || node.attachments?.length
    })
    .map((node) => {
      return { key: node.id, ...node }
    })

  // flatmap all orders' events and give them a synthetic `key` for use with flatlist
  const allOrderEvents = extractNodes(conversation?.orderConnection)
    .reduce<OrderEvent[]>((prev, order) => prev.concat(order.orderHistory), [])
    .map<OrderEventWithKey>((event, index) => ({ ...event, key: `event-${index}` }))

  const orderEventsWithoutFailedPayment = allOrderEvents.filter((event, index) => {
    if (
      !(
        event.state === "APPROVED" &&
        allOrderEvents[index + 1] &&
        allOrderEvents[index + 1].state === "SUBMITTED"
      )
    ) {
      return event
    }
  })

  // Combine and group events/messages
  useEffect(() => {
    const sortedMessages = sortBy([...orderEventsWithoutFailedPayment, ...allMessages], (message) =>
      DateTime.fromISO(message.createdAt ?? "")
    )
    const groupedMessages = groupConversationItems(sortedMessages)

    setMessages(groupedMessages)
  }, [allOrderEvents.length, allMessages.length])

  const flatList = useRef<FlatList>(null)

  const loadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    const updateState = (loading: boolean) => {
      setFetchingMoreData(loading)
      if (onDataFetching) {
        onDataFetching(loading)
      }
    }

    updateState(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Messages.tsx", error.message)
      }
      updateState(false)
    })
  }

  // The scrollToLastMessage method is being called from a parent component
  // TODO: Refactor to not have to use this
  useImperativeHandle(ref, () => ({
    scrollToLastMessage() {
      if (flatList.current && messages.length > 0) {
        flatList.current?.scrollToIndex({ animated: true, index: 0 })
      }
    },
  }))

  const reload = () => {
    const count = extractNodes(conversation.messagesConnection).length
    setReloadingData(true)
    if (onRefresh) {
      onRefresh()
    }
    relay.refetchConnection(count, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Messages.tsx", error.message)
      }
      setReloadingData(false)
    })
  }

  const refreshControl = <RefreshControl refreshing={reloadingData} onRefresh={reload} />

  return (
    <>
      <ToastComponent
        id={1}
        positionIndex={-0.7}
        message="To be covered by the Artsy Guarantee, always communicate and pay through the Artsy platform."
        placement="top"
        backgroundColor="blue100"
        duration="long"
        Icon={() => <ShieldIcon shieldColor="mono0" checkColor="mono0" mr={1} />}
      />
      <FlatList
        key={conversation.internalID}
        data={messages}
        initialNumToRender={messages?.length}
        renderItem={({ item, index }) => {
          return (
            <MessageGroup
              isLastMessage={index === messages.length - 1}
              group={item}
              conversationId={conversation?.internalID ?? ""}
              subjectItem={conversation.items?.[0]?.item}
            />
          )
        }}
        inverted
        ref={flatList}
        keyExtractor={(group) => {
          return group[0].__id
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={refreshControl}
        style={{ paddingHorizontal: 10, flex: 0 }}
        contentContainerStyle={{ justifyContent: "flex-end", flexGrow: 1 }}
        ListFooterComponent={<LoadingIndicator animating={fetchingMoreData} hidesWhenStopped />}
      />
    </>
  )
})

export default createPaginationContainer(
  Messages,
  {
    conversation: graphql`
      fragment Messages_conversation on Conversation
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
        id
        internalID
        from {
          email
        }
        to {
          name
        }
        orderConnection(first: 10, participantType: BUYER) {
          edges {
            node {
              orderHistory {
                ...OrderUpdate_event
                __typename
                ... on CommerceOrderStateChangedEvent {
                  createdAt
                  state
                  stateReason
                }
                ... on CommerceOfferSubmittedEvent {
                  createdAt
                }
              }
            }
          }
        }
        messagesConnection(first: $count, after: $after, sort: DESC)
          @connection(key: "Messages_messagesConnection", filters: []) {
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          }
          edges {
            cursor
            node {
              __typename
              id
              internalID
              isFromUser
              isFirstMessage
              body
              createdAt
              attachments {
                id
                internalID
                contentType
                downloadURL
                fileName
                ...ImagePreview_attachment
                ...PDFPreview_attachment
                ...FileDownload_attachment
              }
              ...Message_message
            }
          }
        }
        items {
          item {
            __typename
            ... on Artwork {
              href
              ...ArtworkPreview_artwork
            }
            ... on Show {
              href
              createdAt
              ...ShowPreview_show
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.conversation?.messagesConnection
    },
    getVariables(props, { count, cursor: after }, _fragmentVariables) {
      return {
        conversationID: props.conversation.internalID,
        count,
        after,
      }
    },
    query: graphql`
      query MessagesQuery($count: Int, $after: String, $conversationID: String!) {
        me {
          conversation(id: $conversationID) {
            ...Messages_conversation @arguments(count: $count, after: $after)
          }
        }
      }
    `,
  }
)
