import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { Action, action, Thunk, thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AppStore } from "lib/store/AppStore"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface BottomTabsModel {
  sessionState: {
    unreadConversationCount: number
  }
  selectedTab: BottomTabType
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>

  switchTab: Action<BottomTabsModel, BottomTabType>
  // TODO: move navigation routing logic to TS so this can be a source of truth rather
  // than derived from the native state
}

export const BottomTabsModel: BottomTabsModel = {
  sessionState: {
    unreadConversationCount: 0,
  },
  selectedTab: "home",
  unreadConversationCountChanged: action((state, unreadConversationCount) => {
    state.sessionState.unreadConversationCount = unreadConversationCount
  }),
  fetchCurrentUnreadConversationCount: thunk(async () => {
    const result = await fetchQuery<BottomTabsModelFetchCurrentUnreadConversationCountQuery>(
      defaultEnvironment,
      graphql`
        query BottomTabsModelFetchCurrentUnreadConversationCountQuery {
          me @principalField {
            unreadConversationCount
          }
        }
      `,
      {},
      { force: true }
    )
    if (result?.me?.unreadConversationCount != null) {
      AppStore.actions.bottomTabs.unreadConversationCountChanged(result.me.unreadConversationCount)
      AppStore.actions.native.setApplicationIconBadgeNumber(result.me.unreadConversationCount)
    }
  }),
  switchTab: action((state, tabType) => {
    state.selectedTab = tabType
  }),
}
