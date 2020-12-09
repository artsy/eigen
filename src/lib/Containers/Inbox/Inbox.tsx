import { Inbox_me } from "__generated__/Inbox_me.graphql"
import { InboxQuery } from "__generated__/InboxQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ConversationsContainer } from "lib/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBidsContainer } from "lib/Scenes/MyBids/MyBids"
import { listenToNativeEvents } from "lib/store/NativeModel"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Flex, Separator, Text } from "palette"
import React from "react"
import {
  EmitterSubscription,
  LayoutChangeEvent,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  View,
  ViewProps,
} from "react-native"
// @ts-expect-error @types file generates duplicate declaration problems
import ScrollableTabView, { TabBarProps } from "react-native-scrollable-tab-view"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

// Tabs
interface ScrollableTabProps extends ScrollViewProps {
  tabLabel: string
}

// changing this to a normal view fixes the issue where refreshing only works the first time,
// but not the issue where changing to the second tab breaks refreshing on both tabs
// this is even after making the changes below which move the refreshControl logic into
// each individual compoent
const TabWrapper: React.FC<ScrollableTabProps> = (props) => <View {...props} />

const InboxTabs: React.FC<TabBarProps> = (props) => (
  <>
    <Flex flexDirection="row" px={1.5} mb={1}>
      {props.tabs?.map((name: JSX.Element, page: number) => {
        const isTabActive = props.activeTab === page
        return (
          <Text
            mr={2}
            key={`inbox-tab-${name}`}
            color={isTabActive ? "black100" : "black30"}
            variant="largeTitle"
            onPress={() => {
              if (!!props.goToPage) {
                props.goToPage(page)
              }
            }}
          >
            {name}
          </Text>
        )
      })}
    </Flex>
    <Separator />
  </>
)

// Inbox
interface State {
  fetchingData: boolean
  selectedTab: "bids" | "conversations"
}

interface Props {
  me: Inbox_me
  relay: RelayRefetchProp
  isVisible: boolean
}

export class Inbox extends React.Component<Props, State> {
  // @ts-ignore STRICTNESS_MIGRATION
  conversations: ConversationsRef

  // @ts-ignore STRICTNESS_MIGRATION
  myBids: MyBidsRef

  state = {
    fetchingData: false,
    selectedTab: "bids" as any,
  }

  scrollViewVerticalStart = 0

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

    // FIXME: This is leftover from WIP work and likely buggy because
    // this component no longer is responsible for refetching its children's
    // relay queries
    if (this.conversations) {
      console.warn("fetchData - refreshing conversations")
      this.conversations?.refreshConversations(() => {
        this.setState({ fetchingData: false })
      })
    } else if (this.myBids) {
      console.warn("fetchData - refreshing bids")
      this.myBids?.refreshMyBids(() => {
        this.setState({ fetchingData: false })
      })
    } else {
      console.warn("fetchData - fallback")
      this.props.relay.refetch({}, null, () => {
        this.setState({ fetchingData: false })
      })
    }
    console.warn("fetchData - end")
  }

  onScrollableTabViewLayout = (layout: LayoutChangeEvent) => {
    this.scrollViewVerticalStart = layout.nativeEvent.layout.y
  }

  render() {
    const bottomInset = this.scrollViewVerticalStart
    // no longer used
    const refreshControl = (
      <RefreshControl
        refreshing={this.state.fetchingData}
        onRefresh={() => {
          console.warn("pulled")
          this.fetchData()
        }}
      />
    )
    return (
      <ScrollableTabView
        style={{ paddingTop: 50 }}
        initialPage={0}
        renderTabBar={() => <InboxTabs />}
        onChangeTab={({ i }: { i: number }) => {
          // leftover from an idea where we would use selectedTab rather than component refs
          // in fetchData - it didn't work either
          this.setState({ selectedTab: i === 0 ? "bids" : "conversations" })
        }}
        contentProps={{
          contentInset: { bottom: bottomInset },
          onLayout: this.onScrollableTabViewLayout,
        }}
      >
        <TabWrapper
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          tabLabel="Bids"
          key="bids"
          refreshControl={refreshControl}
        >
          <MyBidsContainer
            me={this.props.me}
            componentRef={(myBids) => {
              // commented out for test below to work
              this.myBids = myBids
            }}
          />
        </TabWrapper>
        <TabWrapper
          tabLabel="Inquiries"
          key="inquiries"
          // no longer used
          refreshControl={refreshControl}
        >
          {/* even if this is another MyBidsContainer its presence after visiting breaks the refreshControl */}
          <ConversationsContainer
            me={this.props.me}
            componentRef={(conversations) => {
              //  is this ref changing?
              // this.conversations && console.warn("Same conversations ref: ", conversations === this.conversations)
              this.conversations = conversations
            }}
          />
        </TabWrapper>
      </ScrollableTabView>
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
