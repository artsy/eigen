import { Inbox_me } from "__generated__/Inbox_me.graphql"
import { InboxQuery } from "__generated__/InboxQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ConversationsContainer } from "lib/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBidsContainer } from "lib/Scenes/MyBids/MyBids"
import { listenToNativeEvents } from "lib/store/NativeModel"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { EmitterSubscription, RefreshControl } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

interface State {
  fetchingData: boolean
  inquiryTabIsSelected: boolean
}

interface Props {
  me: Inbox_me
  relay: RelayRefetchProp
  isVisible: boolean
}

const Container = styled.ScrollView`
  flex: 1;
`
export class Inbox extends React.Component<Props, State> {
  // @ts-ignore STRICTNESS_MIGRATION
  conversations: ConversationsRef

  state = {
    fetchingData: false,
    inquiryTabIsSelected: false,
  }

  listener: EmitterSubscription | null = null

  flatListHeight = 0

  componentDidMount() {
    this.listener = listenToNativeEvents((event) => {
      if (event.type === "NOTIFICATION_RECEIVED") {
        this.fetchData()
      }
    })
  }

  componentWillUnmount() {
    this.listener?.remove()
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (newProps.isVisible) {
      this.fetchData()
    }
  }

  fetchData = () => {
    if (this.state.fetchingData) {
      return
    }

    this.setState({ fetchingData: true })

    if (this.conversations) {
      this.conversations.refreshConversations(() => {
        this.setState({ fetchingData: false })
      })
    } else {
      this.props.relay.refetch({}, null, () => {
        this.setState({ fetchingData: false })
      })
    }
  }

  render() {
    return (
      <Container refreshControl={<RefreshControl refreshing={this.state.fetchingData} onRefresh={this.fetchData} />}>
        <Spacer pb={5} />
        <Flex flexDirection="row" px={1.5} mb={1}>
          <Text
            mr={2}
            color={this.state.inquiryTabIsSelected ? "black30" : "black100"}
            onPress={() => {
              this.setState({ inquiryTabIsSelected: false })
            }}
            variant="largeTitle"
          >
            Bids
          </Text>
          <Text
            color={this.state.inquiryTabIsSelected ? "black100" : "black30"}
            onPress={() => {
              this.setState({ inquiryTabIsSelected: true })
            }}
            variant="largeTitle"
          >
            Inquiries
          </Text>
        </Flex>
        {this.state.inquiryTabIsSelected ? (
          <ConversationsContainer
            me={this.props.me}
            componentRef={(conversations) => (this.conversations = conversations)}
          />
        ) : (
          <MyBidsContainer me={this.props.me} />
        )}
      </Container>
    )
  }
}

export const InboxContainer = createRefetchContainer(
  Inbox,
  {
    me: graphql`
      fragment Inbox_me on Me {
        ...Conversations_me
        ...MyBids_me
      }
    `,
  },
  graphql`
    query InboxRefetchQuery {
      me {
        ...Inbox_me
      }
    }
  `
)

export const InboxQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<InboxQuery>
      environment={defaultEnvironment}
      query={graphql`
        query InboxQuery {
          me {
            ...Inbox_me
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{}}
      render={renderWithLoadProgress(InboxContainer)}
    />
  )
}
