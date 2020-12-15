import { Inbox_me } from "__generated__/Inbox_me.graphql"
import { InboxQuery } from "__generated__/InboxQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Conversations, ConversationsContainer } from "lib/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBids, MyBidsContainer } from "lib/Scenes/MyBids/MyBids"
import { listenToNativeEvents } from "lib/store/NativeModel"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { EmitterSubscription, LayoutChangeEvent, View, ViewProps } from "react-native"
// @ts-expect-error @types file generates duplicate declaration problems
import ScrollableTabView, { TabBarProps } from "react-native-scrollable-tab-view"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

// Tabs
interface TabWrapperProps extends ViewProps {
  tabLabel: string
}

const TabWrapper: React.FC<TabWrapperProps> = (props) => <View {...props} />

const InboxTabs: React.FC<TabBarProps> = (props) => (
  <>
    <Flex flexDirection="row" px={1.5} mb={2}>
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
}

interface Props {
  me: Inbox_me
  relay: RelayRefetchProp
  isVisible: boolean
}

type RefetchableComponent = React.ComponentType & { refetchData: (cb: () => void) => void }

export const Inbox: React.FC<Props> = ({ isVisible, me, relay }) => {
  const [isFetching, setFetching] = React.useState<boolean>(false)
  const [notificationListener, setNotificationListener] = React.useState<EmitterSubscription | null>(null)

  // TODO: Maybe this should actually be a useRef
  const [scrollViewVerticalStart, setScrollViewVerticalStart] = React.useState(0)

  const myBidsRef = React.useRef<RefetchableComponent>(null as any)
  const conversationsRef = React.useRef<RefetchableComponent>(null as any)

  const [activeTab, setActiveTab] = React.useState<React.MutableRefObject<RefetchableComponent>>(myBidsRef)

  const handleChangeTab = ({ i: tabIndex }: { i: number }) => {
    if (tabIndex === 0) {
      setActiveTab(myBidsRef)
    } else {
      setActiveTab(conversationsRef)
    }
  }

  const fetchData = () => {
    console.warn("fetchData", isFetching, activeTab?.current)
    if (isFetching) {
      return
    } else if (!!activeTab?.current) {
      setFetching(true)
      activeTab?.current?.refetchData(() => setFetching(false))
      // also refetch from relay?
    }
  }

  const onScrollableTabViewLayout = (layout: LayoutChangeEvent) => {
    setScrollViewVerticalStart(layout.nativeEvent.layout.y)
  }

  // set up a native event listener on mount; remove it on unmount
  React.useEffect(() => {
    const listener = listenToNativeEvents((event) => {
      if (event.type === "NOTIFICATION_RECEIVED") {
        fetchData()
      }
    })
    setNotificationListener(listener)
    return () => notificationListener?.remove()
  }, [])

  // refetch when becoming visible
  React.useEffect(() => {
    console.warn(isVisible)
    if (isVisible) {
      fetchData()
    }
  }, [isVisible])

  return (
    <ScrollableTabView
      style={{ paddingTop: 30 }}
      initialPage={0}
      renderTabBar={() => <InboxTabs />}
      onChangeTab={handleChangeTab}
      contentProps={{
        contentInset: { bottom: scrollViewVerticalStart },
        onLayout: onScrollableTabViewLayout,
      }}
    >
      <TabWrapper tabLabel="Bids" key="bids" style={{ flexGrow: 1, justifyContent: "center" }}>
        <MyBidsContainer me={me} componentRef={myBidsRef} />
      </TabWrapper>
      <TabWrapper tabLabel="Inquiries" key="inquiries" style={{ flexGrow: 1, justifyContent: "flex-start" }}>
        <ConversationsContainer me={me} componentRef={conversationsRef} />
      </TabWrapper>
    </ScrollableTabView>
  )
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

export const InboxQueryRenderer: React.FC<{ isVisible: boolean }> = (props) => {
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
      render={(...args) => {
        return renderWithLoadProgress(InboxContainer, props)(...args)
      }}
    />
  )
}
