import { ActionType } from "@artsy/cohesion"
import {
  Flex,
  Screen,
  Separator,
  Skeleton,
  SkeletonText,
  Spacer,
  Tabs,
} from "@artsy/palette-mobile"
import { TabsContainer } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { StackScreenProps } from "@react-navigation/stack"
import * as Sentry from "@sentry/react-native"
import { InboxQuery } from "__generated__/InboxQuery.graphql"
import { Inbox_me$data } from "__generated__/Inbox_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { ConversationsContainer } from "app/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBidsContainer } from "app/Scenes/MyBids/MyBids"
import { listenToNativeEvents } from "app/store/NativeModel"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { ActionNames, ActionTypes } from "app/utils/track/schema"
import React, { memo, useEffect, useRef, useState } from "react"
import { EmitterSubscription } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

enum Tab {
  bids = "bids",
  inquiries = "inquiries",
}

interface Props {
  me: Inbox_me$data
  relay: RelayRefetchProp
  isVisible: boolean
}

export const Inbox: React.FC<Props> = memo(({ me, relay: _relay, isVisible: _isVisible }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.bids)
  const listenerRef = useRef<EmitterSubscription | null>(null)
  const tracking = useTracking()

  useEffect(() => {
    listenerRef.current = listenToNativeEvents((event) => {
      if (event.type === "NOTIFICATION_RECEIVED") {
        // TODO: Figure out this one, maybe in the individual components
        // or maybe set a 'force refetch' state, pass into the isActiveTab prop (with a better name), and then unset it
        // this.fetchData()
      }
    })

    return () => {
      listenerRef.current?.remove?.()
    }
  }, [])

  const handleNavigationTab = (tabName: string) => {
    const index = tabName === "bids" ? 0 : 1
    const tabs = ["inboxBids", "inboxInquiries"]

    tracking.trackEvent({
      action: ActionType.tappedNavigationTab,
      context_module: tabs[index],
      context_screen_owner_type: tabs[index],
      action_type: ActionTypes.Tap,
      action_name: ActionNames.InboxTab,
    })

    setActiveTab(tabName as Tab)
  }

  const hasActiveBids = (me?.myBids?.active ?? []).length > 0
  const initialPageName = hasActiveBids ? "bids" : "inquiries"

  return (
    <TabsContainer
      initialTabName={initialPageName}
      onTabChange={({ tabName }) => handleNavigationTab(tabName)}
    >
      <Tabs.Tab name="bids" label="Bids">
        <MyBidsContainer isActiveTab={activeTab === Tab.bids} me={me} />
      </Tabs.Tab>
      <Tabs.Tab name="inquiries" label="Inquiries">
        <ConversationsContainer me={me} isActiveTab={activeTab === Tab.inquiries} />
      </Tabs.Tab>
    </TabsContainer>
  )
})

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

export const InboxPlaceholder = () => {
  return (
    <Screen>
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
    </Screen>
  )
}

interface InboxQueryRendererProps extends StackScreenProps<any> {
  isVisible?: boolean
}

const InboxQueryRenderer: React.FC<InboxQueryRendererProps> = memo((props) => {
  const data = useLazyLoadQuery<InboxQuery>(
    InboxScreenQuery,
    {},
    { fetchPolicy: "store-and-network" }
  )

  return (
    <Sentry.TimeToInitialDisplay record>
      <Screen>
        <InboxContainer {...props} me={data.me} />
      </Screen>
    </Sentry.TimeToInitialDisplay>
  )
})

export const InboxScreen = withSuspense({
  Component: InboxQueryRenderer,
  LoadingFallback: InboxPlaceholder,
  ErrorFallback: () => {
    return <LoadFailureView trackErrorBoundary={false} />
  },
})
