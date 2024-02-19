import { captureException, captureMessage } from "@sentry/react-native"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { BottomTabsModelFetchNotificationsInfoQuery } from "__generated__/BottomTabsModelFetchNotificationsInfoQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { bottomTabsRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Action, action, computed, Computed, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import { Environment, fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface UnreadCounts {
  conversations: number
}

interface UnseenCounts {
  notifications: number
}

type ProfileTabType = Record<
  Extract<"profile", BottomTabType>,
  {
    savedArtwork?: boolean
  }
>

type TabProps = Partial<Record<Exclude<BottomTabType, "profile">, any> & ProfileTabType>

export interface BottomTabsModel {
  sessionState: {
    unreadCounts: UnreadCounts
    unseenCounts: UnseenCounts
    tabProps: TabProps
    selectedTab: BottomTabType
  }
  syncApplicationIconBadgeNumber: ThunkOn<BottomTabsModel>
  setUnreadConversationsCount: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>
  setUnseenNotificationsCount: Action<BottomTabsModel, number>
  fetchNotificationsInfo: Thunk<BottomTabsModel>
  setTabProps: Action<BottomTabsModel, { tab: BottomTabType; props: object | undefined }>
  setSelectedTab: Action<BottomTabsModel, BottomTabType>
  hasUnseenNotifications: Computed<this, boolean>
}

export const getBottomTabsModel = (): BottomTabsModel => ({
  sessionState: {
    unreadCounts: {
      conversations: 0,
    },
    unseenCounts: {
      notifications: 0,
    },
    tabProps: {},
    selectedTab: "home",
  },
  syncApplicationIconBadgeNumber: thunkOn(
    (actions) => [actions.setUnreadConversationsCount, actions.setUnseenNotificationsCount],
    (_actions, _payload, { getState }) => {
      const { sessionState } = getState()
      const { conversations } = sessionState.unreadCounts
      const { notifications } = sessionState.unseenCounts
      const totalCount = notifications + conversations

      GlobalStore.actions.native.setApplicationIconBadgeNumber(totalCount)
    }
  ),
  setUnreadConversationsCount: action((state, payload) => {
    state.sessionState.unreadCounts.conversations = payload
  }),
  fetchCurrentUnreadConversationCount: thunk(async () => {
    try {
      const result = await fetchQuery<BottomTabsModelFetchCurrentUnreadConversationCountQuery>(
        bottomTabsRelayEnvironment as Environment,
        graphql`
          query BottomTabsModelFetchCurrentUnreadConversationCountQuery {
            me @principalField {
              unreadConversationCount
            }
          }
        `,
        {},
        {
          fetchPolicy: "network-only",
        }
      ).toPromise()

      const conversationsCount = result?.me?.unreadConversationCount

      if (conversationsCount !== null) {
        GlobalStore.actions.bottomTabs.setUnreadConversationsCount(conversationsCount ?? 0)
      }
    } catch (e) {
      if (__DEV__) {
        console.warn(
          "[DEV] Couldn't fetch unreadConversationCount.\n\nThis happens from time to time in staging. If it's happening reliably for you, there's a problem and you should look into it."
        )
        console.log(e)
      } else {
        captureMessage(`fetchCurrentUnreadConversationCount failed:`)
        captureException(JSON.stringify(e))
      }
    }
  }),
  setUnseenNotificationsCount: action((state, payload) => {
    state.sessionState.unseenCounts.notifications = payload
  }),
  fetchNotificationsInfo: thunk(async () => {
    try {
      const query = fetchQuery<BottomTabsModelFetchNotificationsInfoQuery>(
        bottomTabsRelayEnvironment as Environment,
        graphql`
          query BottomTabsModelFetchNotificationsInfoQuery {
            me @principalField {
              unreadConversationCount
              unseenNotificationsCount
            }
          }
        `,
        {},
        {
          fetchPolicy: "network-only",
        }
      )
      const result = await query.toPromise()

      const conversations = result?.me?.unreadConversationCount ?? 0
      const unseenNotifications = result?.me?.unseenNotificationsCount ?? 0

      GlobalStore.actions.bottomTabs.setUnreadConversationsCount(conversations)
      GlobalStore.actions.bottomTabs.setUnseenNotificationsCount(unseenNotifications)
    } catch (e) {
      if (__DEV__) {
        console.warn(
          "[DEV] Couldn't fetch unread counts.\n\nIf it's happening reliably for you, there's a problem and you should look into it."
        )
        console.log(e)
      } else {
        captureException(e)
      }
    }
  }),
  setTabProps: action((state, { tab, props }) => {
    state.sessionState.tabProps[tab] = props
  }),
  setSelectedTab: action((state, payload) => {
    state.sessionState.selectedTab = payload
  }),
  hasUnseenNotifications: computed((state) => state.sessionState.unseenCounts.notifications > 0),
})
