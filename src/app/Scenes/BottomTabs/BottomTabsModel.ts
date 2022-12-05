import { captureException } from "@sentry/react-native"
import { BottomTabsModelFetchAllNotificationsCountsQuery } from "__generated__/BottomTabsModelFetchAllNotificationsCountsQuery.graphql"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { createEnvironment } from "app/relay/createEnvironment"
import {
  metaphysicsURLMiddleware,
  persistedQueryMiddleware,
} from "app/relay/middlewares/metaphysicsMiddleware"
import { simpleLoggerMiddleware } from "app/relay/middlewares/simpleLoggerMiddleware"
import { GlobalStore } from "app/store/GlobalStore"
import { Action, action, Thunk, thunk } from "easy-peasy"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface UnreadCounts {
  unreadConversationCount: number
  unreadActivityPanelNotificationsCount: number
}

export interface BottomTabsModel {
  sessionState: {
    unreadCounts: UnreadCounts
    displayUnreadActivityPanelIndicator: boolean
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
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
      unreadConversationCount: 0,
      unreadActivityPanelNotificationsCount: 0,
    },
    displayUnreadActivityPanelIndicator: false,
    tabProps: {},
    selectedTab: "home",
  },
  unreadConversationCountChanged: action((state, unreadConversationCount) => {
    state.sessionState.unreadCounts.unreadConversationCount = unreadConversationCount
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
        GlobalStore.actions.native.setApplicationIconBadgeNumber(conversationsCount ?? 0)
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
  unreadActivityPanelNotificationsCountChanged: action(
    (state, unreadActivityPanelNotificationsCount) => {
      // we want to display the indicator only when there is a new notification
      if (
        unreadActivityPanelNotificationsCount >
        state.sessionState.unreadCounts.unreadActivityPanelNotificationsCount
      ) {
        state.sessionState.displayUnreadActivityPanelIndicator = true
      } else {
        if (state.sessionState.displayUnreadActivityPanelIndicator) {
          state.sessionState.displayUnreadActivityPanelIndicator =
            !!unreadActivityPanelNotificationsCount
        }
      }

      state.sessionState.unreadCounts.unreadActivityPanelNotificationsCount =
        unreadActivityPanelNotificationsCount
    }
  ),
  fetchAllNotificationsCounts: thunk(async () => {
    try {
      const result = await fetchQuery<BottomTabsModelFetchAllNotificationsCountsQuery>(
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
      ).toPromise()

      const conversationsCount = result?.me?.unreadConversationCount
      const notificationsCount = result?.me?.unreadNotificationsCount

      if (conversationsCount !== null) {
        GlobalStore.actions.bottomTabs.unreadConversationCountChanged(conversationsCount ?? 0)
        GlobalStore.actions.native.setApplicationIconBadgeNumber(conversationsCount ?? 0)
      }

      if (notificationsCount !== null) {
        GlobalStore.actions.bottomTabs.unreadActivityPanelNotificationsCountChanged(
          notificationsCount ?? 0
        )
      }
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
