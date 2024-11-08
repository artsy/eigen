import { ActionType } from "@artsy/cohesion"
import {
  Spacer,
  Flex,
  Separator,
  Tabs,
  Skeleton,
  SkeletonText,
  Screen,
} from "@artsy/palette-mobile"
import { TabsContainer } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { StackScreenProps } from "@react-navigation/stack"
import { InboxQuery } from "__generated__/InboxQuery.graphql"
import { Inbox_me$data } from "__generated__/Inbox_me.graphql"
import { ConversationsContainer } from "app/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBidsContainer } from "app/Scenes/MyBids/MyBids"
import { listenToNativeEvents } from "app/store/NativeModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { track } from "app/utils/track"
import { ActionNames, ActionTypes } from "app/utils/track/schema"
import React from "react"
import { EmitterSubscription } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

enum Tab {
  bids = "bids",
  inquiries = "inquiries",
}
// Inbox
interface State {
  fetchingData: boolean
  activeTab: Tab
}

interface Props {
  me: Inbox_me$data
  relay: RelayRefetchProp
  isVisible: boolean
}

@track()
export class Inbox extends React.Component<Props, State> {
  // @ts-ignore STRICTNESS_MIGRATION
  conversations: ConversationsRef

  // @ts-ignore STRICTNESS_MIGRATION
  myBids: MyBidsRef

  state = {
    fetchingData: false,
    activeTab: Tab.bids,
  }

  listener: EmitterSubscription | null = null

  flatListHeight = 0

  componentDidMount() {
    this.listener = listenToNativeEvents((event) => {
      if (event.type === "NOTIFICATION_RECEIVED") {
        // TODO: Figure out this one, maybe in the individual components
        // or maybe set a 'force refetch' state, pass into the isActiveTab prop (with a better name), and then unset it
        // this.fetchData()
      }
    })
  }

  componentWillUnmount() {
    this.listener?.remove?.()
  }

  @track((_props, _state, args) => {
    const index = args[0]
    const tabs = ["inboxBids", "inboxInquiries"]

    return {
      action: ActionType.tappedNavigationTab,
      context_module: tabs[index],
      context_screen_owner_type: tabs[index],
      action_type: ActionTypes.Tap,
      action_name: ActionNames.InboxTab,
    }
  })
  handleNavigationTab(tabName: string) {
    this.setState({ activeTab: tabName as Tab })
  }
  render() {
    const hasActiveBids = (this.props.me?.myBids?.active ?? []).length > 0
    const initialPageName = hasActiveBids ? "bids" : "inquiries"

    return (
      <TabsContainer
        initialTabName={initialPageName}
        onTabChange={({ tabName }) => this.handleNavigationTab(tabName)}
      >
        <Tabs.Tab name="bids" label="Bids">
          <MyBidsContainer isActiveTab={this.state.activeTab === Tab.bids} me={this.props.me} />
        </Tabs.Tab>
        <Tabs.Tab name="inquiries" label="Inquiries">
          <ConversationsContainer
            me={this.props.me}
            isActiveTab={this.state.activeTab === Tab.inquiries}
          />
        </Tabs.Tab>
      </TabsContainer>
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
        myBids {
          active {
            sale {
              internalID
            }
            saleArtworks {
              internalID
            }
          }
        }
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

export const InboxScreenQuery = graphql`
  query InboxQuery {
    me {
      ...Inbox_me
    }
  }
`

interface InboxQueryRendererProps extends StackScreenProps<any> {
  isVisible?: boolean
}

export const InboxQueryRenderer: React.FC<InboxQueryRendererProps> = (props) => {
  return (
    <Screen>
      <QueryRenderer<InboxQuery>
        environment={getRelayEnvironment()}
        query={InboxScreenQuery}
        variables={{}}
        render={(...args) =>
          renderWithPlaceholder({
            Container: InboxContainer,
            initialProps: props,
            renderPlaceholder: () => <InboxPlaceholder />,
          })(...args)
        }
      />
    </Screen>
  )
}

export const InboxPlaceholder = () => {
  return (
    <>
      <Skeleton>
        {/* Tabs */}
        <Flex justifyContent="space-around" flexDirection="row" px={2} pt={1}>
          <SkeletonText variant="sm">Bids</SkeletonText>
          <SkeletonText variant="sm">Inbox</SkeletonText>
        </Flex>
        <Separator mt={1} />
      </Skeleton>
      <Flex flex={1} px={2}>
        <Flex my="auto" alignItems="center">
          <PlaceholderText width={240} />
          <Spacer y={1} />
          <PlaceholderText width={230} />

          <PlaceholderText width={240} />

          <PlaceholderText width={200} />
          <PlaceholderText width={70} />
          <Spacer y={1} />

          <PlaceholderBox width={176} height={50} borderRadius={25} />
        </Flex>
      </Flex>
    </>
  )
}
