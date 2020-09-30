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
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>

  selectedTab: BottomTabType
}

export const BottomTabsModel: BottomTabsModel = {
  sessionState: {
    unreadConversationCount: 0,
  },
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

  selectedTab: "home",
}
