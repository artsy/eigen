import React from "react"
import { Dimensions, FlatList, RefreshControl, ViewStyle } from "react-native"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { PAGE_SIZE } from "lib/data/constants"

import ARSwitchBoard from "../../../NativeModules/SwitchBoard"
import Message from "./Message"
import ArtworkPreview from "./Preview/ArtworkPreview"
import ShowPreview from "./Preview/ShowPreview"

import { Messages_conversation } from "__generated__/Messages_conversation.graphql"

const isPad = Dimensions.get("window").width > 700

interface Props {
  conversation: Messages_conversation
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
  reloadingData: boolean
  shouldStickFirstMessageToTop: boolean
}

const LoadingIndicator = styled.ActivityIndicator`
  margin-top: 40px;
`

export class Messages extends React.Component<Props, State> {
  flatList: FlatList<any>

  state = {
    fetchingMoreData: false,
    reloadingData: false,
    shouldStickFirstMessageToTop: false,
  }

  renderMessage({ item, index }) {
    const conversation = this.props.conversation
    const { artwork, show } = conversation.items[0]
    const partnerName = conversation.to.name
    const senderName = item.is_from_user ? conversation.from.name : partnerName
    const initials = item.is_from_user ? conversation.from.initials : conversation.to.initials
    // FIXME: This is the same bug as described in ArtworkCarouselHeader.
    return (
      <Message
        index={index}
        firstMessage={item.first_message}
        initialText={conversation.initial_message}
        message={item}
        conversationId={conversation.internalID}
        senderName={senderName}
        initials={initials}
        artworkPreview={
          item.first_message &&
          artwork.href && (
            <ArtworkPreview
              artwork={artwork as any}
              onSelected={() => ARSwitchBoard.presentNavigationViewController(this, artwork.href)}
            />
          )
        }
        showPreview={
          item.first_message &&
          show.href && (
            <ShowPreview
              show={show as any}
              onSelected={() => ARSwitchBoard.presentNavigationViewController(this, show.href)}
            />
          )
        }
      />
    )
  }

  loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    const updateState = (loading: boolean) => {
      this.setState({ fetchingMoreData: loading })
      if (this.props.onDataFetching) {
        this.props.onDataFetching(loading)
      }
    }

    updateState(true)
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Messages.tsx", error.message)
      }
      updateState(false)
    })
  }

  scrollToLastMessage() {
    // TODO: This will break in the new RN without a viewOffset parameter
    this.flatList.scrollToIndex({ animated: true, index: 0 })
  }

  reload() {
    const count = this.props.conversation.messages.edges.length
    this.setState({ reloadingData: true })
    this.props.relay.refetchConnection(count, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Messages.tsx", error.message)
      }
      this.setState({ reloadingData: false })
    })
  }

  render() {
    const edges = (this.props.conversation.messages && this.props.conversation.messages.edges) || []
    const messageCount = edges.length

    const messages = edges
      .filter(edge => {
        return (edge.node.body && edge.node.body.length) || (edge.node.attachments && edge.node.attachments.length)
      })
      .map((edge, index) => {
        const isFirstMessage = this.props.relay && !this.props.relay.hasMore() && index === messageCount - 1
        return { first_message: isFirstMessage, key: edge.cursor, ...edge.node }
      })

    const refreshControl = <RefreshControl refreshing={this.state.reloadingData} onRefresh={this.reload.bind(this)} />

    const messagesStyles: Partial<ViewStyle> = isPad
      ? {
          width: 708,
          alignSelf: "center",
        }
      : {}

    return (
      <FlatList
        inverted={!this.state.shouldStickFirstMessageToTop}
        data={this.state.shouldStickFirstMessageToTop ? messages.reverse() : messages}
        renderItem={this.renderMessage.bind(this)}
        ref={flatList => (this.flatList = flatList as any)}
        keyExtractor={({ id }) => id}
        keyboardShouldPersistTaps="always"
        onEndReached={this.loadMore.bind(this)}
        onEndReachedThreshold={0.2}
        onContentSizeChange={(_width, height) => {
          // If there aren't enough items to scroll through
          // display messages from the top
          const windowHeight = Dimensions.get("window").height
          const containerHeight = windowHeight - 100
          const shouldStickFirstMessageToTop = height < containerHeight

          this.setState({
            shouldStickFirstMessageToTop,
          })
        }}
        refreshControl={refreshControl}
        style={messagesStyles}
        ListFooterComponent={<LoadingIndicator animating={this.state.fetchingMoreData} hidesWhenStopped />}
      />
    )
  }
}

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
          initials
        }
        to {
          name
          initials
        }
        initial_message
        messages(first: $count, after: $after, sort: DESC) @connection(key: "Messages_messages", filters: []) {
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
              impulse_id
              is_from_user
              body
              attachments {
                internalID
              }
              ...Message_message
            }
          }
        }
        items {
          artwork: item {
            ... on Artwork {
              href
              ...ArtworkPreview_artwork
            }
          }
          show: item {
            ... on Show {
              href
              ...ShowPreview_show
            }
          }
          # FIXME: Working around a type generator bug, see ArtworkCarouselHeader.tsx for details.
          #
          # item {
          #   __typename
          #   ... on Artwork {
          #     href
          #     ...ArtworkPreview_artwork
          #   }
          #   ... on Show {
          #     href
          #     ...ShowPreview_show
          #   }
          # }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.conversation && (props.conversation.messages as ConnectionData)
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, _fragmentVariables) {
      return {
        conversationID: props.conversation.id,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
    query: graphql`
      query MessagesQuery($conversationID: String!, $count: Int!, $after: String) {
        me {
          conversation(id: $conversationID) {
            ...Messages_conversation @arguments(count: $count, after: $after)
          }
        }
      }
    `,
  }
)
