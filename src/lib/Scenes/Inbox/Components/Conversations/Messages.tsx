import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Dimensions, FlatList, RefreshControl, ViewStyle } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { PAGE_SIZE } from "lib/data/constants"

import { DisplayableMessage, MessageGroup } from "./MessageGroup"

import { Messages_conversation } from "__generated__/Messages_conversation.graphql"
import { extractNodes } from "lib/utils/extractNodes"

import { Message_message } from "__generated__/Message_message.graphql"
import { OrderUpdate_event } from "__generated__/OrderUpdate_event.graphql"
import { sortBy } from "lodash"
import { DateTime } from "luxon"
import { groupMessages } from "./utils/groupMessages"
import { Conversation } from "../../Screens/Conversation"

const isPad = Dimensions.get("window").width > 700

interface Props {
  conversation: Messages_conversation
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

const LoadingIndicator = styled.ActivityIndicator`
  margin-top: 40px;
`

type Order = NonNullable<
  NonNullable<NonNullable<NonNullable<Props["conversation"]["orderConnection"]>["edges"]>[number]>["node"]
>
type OrderHistoryEvent = Order["orderHistory"][number]

export type ConversationMessage = NonNullable<
  NonNullable<NonNullable<NonNullable<Props["conversation"]["messagesConnection"]>["edges"]>[number]>["node"]
>

export const Messages: React.FC<Props> = forwardRef((props, ref) => {
  const { conversation, relay, onDataFetching } = props

  const [fetchingMoreData, setFetchingMoreData] = useState(false)
  const [reloadingData, setReloadingData] = useState(false)

  const [messages, setMessages] = useState<MessageGroup[]>()

  const orders: Order[] = extractNodes(conversation?.orderConnection)

  const allOrderEvents: OrderHistoryEvent[] = orders
    .reduce<OrderHistoryEvent[]>((prev, order) => prev.concat(order.orderHistory), [])
    .map((event, index) => ({ ...event, key: `event-${index}` }))

  useEffect(() => {
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

    const sortedMessages = sortBy([...allOrderEvents, ...allMessages], (message) =>
      DateTime.fromISO(message.createdAt!)
    )
    // TODO: Check ordering and reversing around here
    const groupedMessages = groupMessages(sortedMessages as any)

    setMessages(groupedMessages)
  }, [conversation.messagesConnection])

  const flatList = useRef<FlatList>(null)
  const [flatListHeight, setFlatListHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [shouldStickFirstMessageToTop, setShouldStickFirstMessageToTop] = useState(false)

  useEffect(() => {
    setShouldStickFirstMessageToTop(contentHeight < flatListHeight)
  }, [contentHeight || flatListHeight])

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
      flatList.current?.scrollToIndex({ animated: true, index: 0 })
    },
  }))

  const reload = () => {
    const count = extractNodes(conversation.messagesConnection).length
    setReloadingData(true)
    relay.refetchConnection(count, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Messages.tsx", error.message)
      }
      setReloadingData(false)
    })
  }

  const refreshControl = <RefreshControl refreshing={reloadingData} onRefresh={reload} />

  const messagesStyles: Partial<ViewStyle> = isPad
    ? {
        width: 708,
        alignSelf: "center",
      }
    : {}

  return (
    <FlatList<MessageGroup>
      key={conversation.internalID!}
      data={messages}
      initialNumToRender={messages?.length}
      renderItem={({ item, index }) => {
        return (
          <MessageGroup
            group={item}
            conversationId={conversation.internalID!}
            subjectItem={conversation.items?.[0]?.item!}
            key={`group-${index}-${(item[0] as any)?.key}`}
          />
        )
      }}
      inverted={!shouldStickFirstMessageToTop}
      ref={flatList}
      keyExtractor={({ key }) => key} // TODO: unneeded?
      keyboardShouldPersistTaps="always"
      onEndReached={loadMore}
      onEndReachedThreshold={0.2}
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        setFlatListHeight(height)
      }}
      onContentSizeChange={(_width, height) => {
        setContentHeight(height)
      }}
      refreshControl={refreshControl}
      style={{ ...messagesStyles, paddingHorizontal: 10, flex: 0 }}
      ListFooterComponent={<LoadingIndicator animating={fetchingMoreData} hidesWhenStopped />}
    />
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
          name
          email
        }
        to {
          name
        }
        initialMessage
        lastMessageID
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
