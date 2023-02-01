import { captureException } from "@sentry/react-native"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { BottomTabsModelFetchNotificationsInfoQuery } from "__generated__/BottomTabsModelFetchNotificationsInfoQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { createEnvironment } from "app/system/relay/createEnvironment"
import {
  metaphysicsURLMiddleware,
  persistedQueryMiddleware,
} from "app/system/relay/middlewares/metaphysicsMiddleware"
import { simpleLoggerMiddleware } from "app/system/relay/middlewares/simpleLoggerMiddleware"
import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import { DateTime } from "luxon"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface UnreadCounts {
  conversations: number
  notifications: number
}

export interface BottomTabsModel {
  sessionState: {
    unreadCounts: UnreadCounts
    displayUnseenNotificationsIndicator: boolean
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
  syncApplicationIconBadgeNumber: ThunkOn<BottomTabsModel>
  setUnreadConversationsCount: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>
  setUnreadNotificationsCount: Action<BottomTabsModel, number>
  decreaseUnreadNotificationsCount: Action<BottomTabsModel>
  fetchNotificationsInfo: Thunk<BottomTabsModel>
  setDisplayUnseenNotificationsIndicator: Action<BottomTabsModel, boolean>
  setTabProps: Action<BottomTabsModel, { tab: BottomTabType; props: object | undefined }>
}

export const getBottomTabsModel = (): BottomTabsModel => ({
  sessionState: {
    unreadCounts: {
      conversations: 0,
      notifications: 0,
    },
    displayUnseenNotificationsIndicator: false,
    tabProps: {},
    selectedTab: "home",
  },
  syncApplicationIconBadgeNumber: thunkOn(
    (actions) => [
      actions.setUnreadConversationsCount,
      actions.setUnreadNotificationsCount,
      actions.decreaseUnreadNotificationsCount,
    ],
    (_actions, _payload, { getState }) => {
      const { notifications, conversations } = getState().sessionState.unreadCounts
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
        GlobalStore.actions.bottomTabs.setUnreadConversationsCount(conversationsCount ?? 0)
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
  setUnreadNotificationsCount: action((state, payload) => {
    state.sessionState.unreadCounts.notifications = payload
  }),
  decreaseUnreadNotificationsCount: action((state) => {
    const nextValue = state.sessionState.unreadCounts.notifications - 1

    if (nextValue >= 0) {
      state.sessionState.unreadCounts.notifications = nextValue
    }
  }),
  fetchNotificationsInfo: thunk(async () => {
    try {
      const query = fetchQuery<BottomTabsModelFetchNotificationsInfoQuery>(
        createEnvironment([
          [persistedQueryMiddleware(), metaphysicsURLMiddleware(), simpleLoggerMiddleware()],
        ]),
        graphql`
          query BottomTabsModelFetchNotificationsInfoQuery {
            me @principalField {
              unreadConversationCount
              unreadNotificationsCount
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
      const notifications = result?.me?.unreadNotificationsCount ?? 0
      const unseenNotifications = result?.me?.unseenNotificationsCount ?? 0
      const shouldDisplayIndicator = unseenNotifications > 0 && notifications > 0

      GlobalStore.actions.bottomTabs.setUnreadConversationsCount(conversations)
      GlobalStore.actions.bottomTabs.setUnreadNotificationsCount(notifications)
      GlobalStore.actions.bottomTabs.setDisplayUnseenNotificationsIndicator(shouldDisplayIndicator)
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
  setDisplayUnseenNotificationsIndicator: action((state, payload) => {
    state.sessionState.displayUnseenNotificationsIndicator = payload
  }),
  setTabProps: action((state, { tab, props }) => {
    state.sessionState.tabProps[tab] = props
  }),
})

const checkIsNewPublishedAt = (prevPublishedAt: string | null, newPublishedAt: string | null) => {
  if (prevPublishedAt === null || newPublishedAt === null) {
    return false
  }

  const prevPublishedDate = DateTime.fromISO(prevPublishedAt)
  const newPublishedDate = DateTime.fromISO(newPublishedAt)

  return newPublishedDate > prevPublishedDate
}
