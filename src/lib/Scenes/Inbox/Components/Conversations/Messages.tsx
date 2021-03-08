import { Messages_conversation } from "__generated__/Messages_conversation.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { extractNodes } from "lib/utils/extractNodes"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Dimensions, FlatList, RefreshControl, ViewStyle } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { MessageGroup } from "./MessageGroup"

import { sortBy } from "lodash"
import { DateTime } from "luxon"
import { groupMessages, MessageGroup as MessageGroupType } from "./utils/groupMessages"

const isPad = Dimensions.get("window").width > 700

interface Props {
  conversation: Messages_conversation
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

const LoadingIndicator = styled.ActivityIndicator`
  margin-top: 40px;
`

export const Messages: React.FC<Props> = forwardRef((props, ref) => {
  const { conversation, relay, onDataFetching } = props

  const [fetchingMoreData, setFetchingMoreData] = useState(false)
  const [reloadingData, setReloadingData] = useState(false)

  const orders = extractNodes(conversation?.orderConnection)
  const allOffers = orders?.[0]?.offers?.nodes || []

  const [messages, setMessages] = useState<MessageGroupType[]>()
  useEffect(() => {
    const messageNodes = extractNodes(conversation.messagesConnection)
      .filter((node) => {
        if (node.isFirstMessage) {
          return true
        }
        return node.body?.length || node.attachments?.length
      })
      .map((node) => {
        return { key: node.id, ...node }
      })
      .reverse()
    const allMessages = sortBy([...allOffers, ...messageNodes], (message) => DateTime.fromISO(message.createdAt))

    setMessages(groupMessages(allMessages))
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
    <FlatList
      key={conversation.internalID!}
      data={messages}
      initialNumToRender={messages?.length}
      renderItem={({ item, index }) => {
        return (
          <MessageGroup
            group={item}
            conversationId={conversation.internalID!}
            subjectItem={conversation.items?.[0]?.item!}
            key={`group-${index}-${item[0]?.key}`}
          />
        )
      }}
      inverted={!shouldStickFirstMessageToTop}
      ref={flatList}
      keyExtractor={({ id }) => id}
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
        orderConnection(first: 10, participantType: BUYER) {
          edges {
            node {
              ... on CommerceOfferOrder {
                internalID
                isInquiryOrder
                state
                stateReason
                stateUpdatedAt
                offers(first: 100) {
                  nodes {
                    ...OfferNotification_offer
                    __typename
                    # amount
                    createdAt
                    # fromParticipant
                    # from {
                    #   __typename
                    # }
                    # respondsTo {
                    #   fromParticipant
                    # }
                    # order {
                    #   state
                    #   stateReason
                    # }
                  }
                }
              }
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
