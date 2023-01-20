import { captureException } from "@sentry/react-native"
import { BottomTabsModelFetchAllNotificationsCountsQuery } from "__generated__/BottomTabsModelFetchAllNotificationsCountsQuery.graphql"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { createEnvironment } from "app/system/relay/createEnvironment"
import {
  metaphysicsURLMiddleware,
  persistedQueryMiddleware,
} from "app/system/relay/middlewares/metaphysicsMiddleware"
import { simpleLoggerMiddleware } from "app/system/relay/middlewares/simpleLoggerMiddleware"
import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface UnreadCounts {
  unreadConversation: number
  unreadActivityPanelNotifications: number
}

export interface BottomTabsModel {
  sessionState: {
    unreadCounts: UnreadCounts
    displayUnreadActivityPanelIndicator: boolean
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
  lastNotificationPublishedAtByUserId: Record<string, string>
  syncApplicationIconBadgeNumber: ThunkOn<BottomTabsModel>
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>
  unreadActivityPanelNotificationsCountChanged: Action<BottomTabsModel, number>
  fetchAllNotificationsCounts: Thunk<BottomTabsModel>
  displayUnreadActivityPanelIndicatorChanged: Action<BottomTabsModel, boolean>
  setTabProps: Action<BottomTabsModel, { tab: BottomTabType; props: object | undefined }>
}

export const getBottomTabsModel = (): BottomTabsModel => ({
  sessionState: {
    unreadCounts: {
      unreadConversation: 0,
      unreadActivityPanelNotifications: 0,
    },
    displayUnreadActivityPanelIndicator: false,
    tabProps: {},
    selectedTab: "home",
  },
  lastNotificationPublishedAtByUserId: {},
  syncApplicationIconBadgeNumber: thunkOn(
    (actions) => [
      actions.unreadConversationCountChanged,
      actions.unreadActivityPanelNotificationsCountChanged,
    ],
    (_actions, _payload, { getState }) => {
      const { unreadActivityPanelNotifications, unreadConversation } =
        getState().sessionState.unreadCounts
      const totalCount = unreadActivityPanelNotifications + unreadConversation
      GlobalStore.actions.native.setApplicationIconBadgeNumber(totalCount)
    }
  ),
  unreadConversationCountChanged: action((state, unreadConversationCount) => {
    state.sessionState.unreadCounts.unreadConversation = unreadConversationCount
  }),
  fetchCurrentUnreadConversationCount: thunk(async () => {
    try {
      const result = await fetchQuery<BottomTabsModelFetchCurrentUnreadConversationCountQuery>(
        createEnvironment([
          [persistedQueryMiddleware(), metaphysicsURLMiddleware(), simpleLoggerMiddleware()],
        ]),
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
        GlobalStore.actions.bottomTabs.unreadConversationCountChanged(conversationsCount ?? 0)
      }
    } catch (e) {
      if (__DEV__) {
        console.warn(
          "[DEV] Couldn't fetch unreadConversationCount.\n\nThis happens from time to time in staging. If it's happening reliably for you, there's a problem and you should look into it."
        )
        console.log(e)
      } else {
        captureException(e)
      }
    }
  }),
  unreadActivityPanelNotificationsCountChanged: action((state, unreadCount) => {
    // we want to display the indicator only when there is a new notification
    if (unreadCount > state.sessionState.unreadCounts.unreadActivityPanelNotifications) {
      state.sessionState.displayUnreadActivityPanelIndicator = true
    }

    // when the user marked all notifications as read
    if (unreadCount === 0) {
      state.sessionState.displayUnreadActivityPanelIndicator = false
    }

    state.sessionState.unreadCounts.unreadActivityPanelNotifications = unreadCount
  }),
  fetchAllNotificationsCounts: thunk(async () => {
    try {
      const query = fetchQuery<BottomTabsModelFetchAllNotificationsCountsQuery>(
        createEnvironment([
          [persistedQueryMiddleware(), metaphysicsURLMiddleware(), simpleLoggerMiddleware()],
        ]),
        graphql`
          query BottomTabsModelFetchAllNotificationsCountsQuery {
            me @principalField {
              unreadConversationCount
              unreadNotificationsCount
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
      const notifications = result?.me?.unreadNotificationsCount ?? 0

      GlobalStore.actions.bottomTabs.unreadConversationCountChanged(conversations)
      GlobalStore.actions.bottomTabs.unreadActivityPanelNotificationsCountChanged(notifications)
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
  displayUnreadActivityPanelIndicatorChanged: action(
    (state, displayUnreadActivityPanelIndicator) => {
      state.sessionState.displayUnreadActivityPanelIndicator = displayUnreadActivityPanelIndicator
    }
  ),
  setTabProps: action((state, { tab, props }) => {
    state.sessionState.tabProps[tab] = props
  }),
})
