import * as React from "react"
import {
  commitMutation,
  createPaginationContainer,
  Environment,
  graphql,
  MutationConfig,
  RecordSourceSelectorProxy,
  RelayPaginationProp,
} from "react-relay"
import styled from "styled-components/native"

import Message from "./Message"
import ArtworkPreview from "./Preview/ArtworkPreview"
import ShowPreview from "./Preview/ShowPreview"
import RelayProps from "./relayInterfaces"

import { FlatList, ImageURISource, NetInfo, View, ViewProperties } from "react-native"
import colors from "../../../../data/colors"

import ARSwitchBoard from "../../../NativeModules/SwitchBoard"

const DottedBorder = styled.View`
  height: 1;
  border-width: 1;
  border-style: dotted;
  border-color: ${colors["gray-regular"]};
  margin-left: 20;
  margin-right: 20;
`

interface Props {
  conversation?: RelayProps["me"]["conversation"]
  relay?: RelayPaginationProp
}

interface State {
  showIndicator: boolean
}

export class Messages extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      showIndicator: false,
    }
  }

  renderMessage({ item }) {
    const conversationItem = this.props.conversation.items[0].item
    const conversation = this.props.conversation
    const partnerName = conversation.to.name
    const senderName = item.is_from_user ? conversation.from.name : partnerName
    const initials = item.is_from_user ? conversation.from.initials : conversation.to.initials
    return (
      <Message
        firstMessage={item.firstMessage}
        initialText={item}
        message={item}
        senderName={senderName}
        initials={initials}
        artworkPreview={
          item.first_message &&
          conversationItem.__typename === "Artwork" &&
          <ArtworkPreview
            artwork={conversationItem}
            onSelected={() => ARSwitchBoard.presentNavigationViewController(this, conversationItem.href)}
          />
        }
        showPreview={
          item.first_message &&
          conversationItem.__typename === "Show" &&
          <ShowPreview
            show={conversationItem}
            onSelected={() => ARSwitchBoard.presentNavigationViewController(this, conversationItem.href)}
          />
        }
      />
    )
  }

  loadMore() {
    // if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
    //   return
    // }

    // TODO show loading indicator

    this.props.relay.loadMore(10, e => {
      // TODO hide loading indicator
      console.log(e)
    })
  }

  render() {
    const messages = (this.props.conversation.messages || { edges: [] }).edges.map((edge, index) => {
      return { first_message: index === 0, key: index, ...edge.node }
    })

    return (
      <FlatList
        inverted
        data={messages}
        renderItem={this.renderMessage.bind(this)}
        onEndReached={this.loadMore.bind(this)}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={DottedBorder}
      />
    )
  }
}

export default createPaginationContainer(
  Messages,
  {
    conversation: graphql.experimental`
      fragment Messages_conversation on Conversation {
        __id
        id
        from {
          name
          email
          initials
        }
        to {
          name
          initials
        }
        messages(first: $count, after: $after) @connection(key: "Messages_messages") {
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          }
          edges {
            cursor
            node {
              impulse_id
              is_from_user
              body
              ...Message_message
            }
          }
        }
        items {
          item {
            ... on Artwork {
              __typename
              href
              ...ArtworkPreview_artwork
            }
            ... on Show {
              __typename
              href
              ...ShowPreview_show
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.conversation && props.conversation.messages
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, fragmentVariables) {
      return {
        conversationID: props.conversation.id,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
    query: graphql`
      query MessagesPaginationQuery($conversationID: String!, $count: Int!, $after: String) {
        me {
          conversation(id: $conversationID) {
            ...Messages_conversation
          }
        }
      }
    `,
  }
)
