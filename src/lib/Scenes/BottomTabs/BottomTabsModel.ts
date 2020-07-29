import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AppStore } from "lib/store/AppStore"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface BottomTabsModel {
  unreadConversationCount: number
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>

  // TODO: move navigation routing logic to TS so this can be a source of truth rather
  // than derived from the native state
  selectedTab: Computed<BottomTabsModel, BottomTabType, AppStoreModel>
}

export const BottomTabsModel: BottomTabsModel = {
  unreadConversationCount: 0,
  unreadConversationCountChanged: action((state, unreadConversationCount) => {
    state.unreadConversationCount = unreadConversationCount
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

  selectedTab: computed([(_, store) => store.native.selectedTab], selectedTab => selectedTab),
}
