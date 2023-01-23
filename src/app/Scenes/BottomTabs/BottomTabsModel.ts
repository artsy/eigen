import { captureException } from "@sentry/react-native"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import {
  BottomTabsModelFetchNotificationsInfoQuery,
  NotificationTypesEnum,
} from "__generated__/BottomTabsModelFetchNotificationsInfoQuery.graphql"
import { isArtworksBasedNotification } from "app/Scenes/Activity/utils/isArtworksBasedNotification"
import { GlobalStore } from "app/store/GlobalStore"
import { createEnvironment } from "app/system/relay/createEnvironment"
import {
  metaphysicsURLMiddleware,
  persistedQueryMiddleware,
} from "app/system/relay/middlewares/metaphysicsMiddleware"
import { simpleLoggerMiddleware } from "app/system/relay/middlewares/simpleLoggerMiddleware"
import { extractNodes } from "app/utils/extractNodes"
import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import { DateTime } from "luxon"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface UnreadCounts {
  unreadConversation: number
  unreadActivityPanelNotifications: number
}

interface NotificationNode {
  notificationType: NotificationTypesEnum
  publishedAt: string
  artworksCount: number
}

export interface BottomTabsModel {
  sessionState: {
    unreadCounts: UnreadCounts
    displayUnreadActivityPanelIndicator: boolean
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
  lastNotificationPublishedAt: string | null
  syncApplicationIconBadgeNumber: ThunkOn<BottomTabsModel>
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  actionChanged: Action<BottomTabsModel, { notifications: NotificationNode[]; unreadCount: number }>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>
  unreadActivityPanelNotificationsCountChanged: Action<BottomTabsModel, number>
  fetchNotificationsInfo: Thunk<BottomTabsModel>
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
  lastNotificationPublishedAt: null,
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
    state.sessionState.unreadCounts.unreadActivityPanelNotifications = unreadCount
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
            }

            viewer {
              notificationsConnection(first: 5) {
                edges {
                  node {
                    notificationType
                    publishedAt

                    artworks: artworksConnection {
                      totalCount
                    }
                  }
                }
              }
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
      const nodes = extractNodes(result?.viewer?.notificationsConnection)
      const formattedNotificationNodes: NotificationNode[] = nodes.map((node) => ({
        publishedAt: node.publishedAt,
        notificationType: node.notificationType,
        artworksCount: node.artworks?.totalCount ?? 0,
      }))

      GlobalStore.actions.bottomTabs.unreadConversationCountChanged(conversations)
      GlobalStore.actions.bottomTabs.unreadActivityPanelNotificationsCountChanged(notifications)
      GlobalStore.actions.bottomTabs.actionChanged({
        notifications: formattedNotificationNodes,
        unreadCount: notifications,
      })
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
  actionChanged: action((state, payload) => {
    const notifications = payload.notifications.filter((node) => {
      if (isArtworksBasedNotification(node.notificationType)) {
        return node.artworksCount > 0
      }

      return true
    })
    const notification = notifications[0]
    const lastPublishedAt = state.lastNotificationPublishedAt

    console.log("[debug] lastPublishedAt", lastPublishedAt)
    console.log("[debug] notification.publishedAt", notification.publishedAt)

    if (lastPublishedAt === null && notification.publishedAt) {
      console.log("[debug] step 1")
      state.lastNotificationPublishedAt = notification.publishedAt
      state.sessionState.displayUnreadActivityPanelIndicator = payload.unreadCount > 0
    }

    if (lastPublishedAt && notification.publishedAt) {
      console.log("[debug] compare dates")
      const prevPublishedDate = DateTime.fromISO(lastPublishedAt)
      const currentPublishedDate = DateTime.fromISO(notification.publishedAt)

      if (currentPublishedDate > prevPublishedDate) {
        console.log("[debug] step 2")
        state.lastNotificationPublishedAt = notification.publishedAt
        state.sessionState.displayUnreadActivityPanelIndicator = payload.unreadCount > 0
      }
    }
  }),
})
