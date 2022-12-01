import { captureException } from "@sentry/react-native"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { BottomTabsModelFetchUnreadActivityPanelNotificationsCountQuery } from "__generated__/BottomTabsModelFetchUnreadActivityPanelNotificationsCountQuery.graphql"
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

export interface BottomTabsModel {
  sessionState: {
    unreadConversationCount: number
    unreadActivityPanelNotificationsCount: number
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>
  unreadActivityPanelNotificationsCountChanged: Action<BottomTabsModel, number>
  fetchUnreadActivityPanelNotificationsCount: Thunk<BottomTabsModel>
  setTabProps: Action<BottomTabsModel, { tab: BottomTabType; props: object | undefined }>
}

export const getBottomTabsModel = (): BottomTabsModel => ({
  sessionState: {
    unreadConversationCount: 0,
    unreadActivityPanelNotificationsCount: 0,
    tabProps: {},
    selectedTab: "home",
  },
  unreadConversationCountChanged: action((state, unreadConversationCount) => {
    state.sessionState.unreadConversationCount = unreadConversationCount
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

      if (result?.me?.unreadConversationCount != null) {
        GlobalStore.actions.bottomTabs.unreadConversationCountChanged(
          result.me.unreadConversationCount
        )
        GlobalStore.actions.native.setApplicationIconBadgeNumber(result.me.unreadConversationCount)
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
      state.sessionState.unreadActivityPanelNotificationsCount =
        unreadActivityPanelNotificationsCount
    }
  ),
  fetchUnreadActivityPanelNotificationsCount: thunk(async () => {
    try {
      const result =
        await fetchQuery<BottomTabsModelFetchUnreadActivityPanelNotificationsCountQuery>(
          createEnvironment([
            [persistedQueryMiddleware(), metaphysicsURLMiddleware(), simpleLoggerMiddleware()],
          ]),
          graphql`
            query BottomTabsModelFetchUnreadActivityPanelNotificationsCountQuery {
              me @principalField {
                unreadNotificationsCount
              }
            }
          `,
          {},
          {
            fetchPolicy: "network-only",
          }
        ).toPromise()

      const notificationsCount = result?.me?.unreadNotificationsCount

      if (notificationsCount != null) {
        GlobalStore.actions.bottomTabs.unreadActivityPanelNotificationsCountChanged(
          notificationsCount
        )
      }
    } catch (e) {
      if (__DEV__) {
        console.warn(
          "[DEV] Couldn't fetch unreadNotificationsCount.\n\nIf it's happening reliably for you, there's a problem and you should look into it."
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
})
