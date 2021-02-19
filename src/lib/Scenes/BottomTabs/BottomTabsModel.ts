import AsyncStorage from "@react-native-community/async-storage"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { Action, action, Thunk, thunk } from "easy-peasy"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { BOTTOM_NAV_STATE_STORAGE_KEY } from "lib/navigation/useReloadedDevNavigationState"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface BottomTabsModel {
  sessionState: {
    unreadConversationCount: number
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>

  switchTab: Action<BottomTabsModel, BottomTabType>
  setTabProps: Action<BottomTabsModel, { tab: BottomTabType; props: object | undefined }>
}

export const BottomTabsModel: BottomTabsModel = {
  sessionState: {
    unreadConversationCount: 0,
    tabProps: {},
    selectedTab: "home",
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
      GlobalStore.actions.bottomTabs.unreadConversationCountChanged(result.me.unreadConversationCount)
      GlobalStore.actions.native.setApplicationIconBadgeNumber(result.me.unreadConversationCount)
    }
  }),
  setTabProps: action((state, { tab, props }) => {
    state.sessionState.tabProps[tab] = props
  }),
  switchTab: action((state, tabType) => {
    state.sessionState.selectedTab = tabType
    persistDevReloadState(tabType)
  }),
}

// We want the selected tab state to persist across dev reloads, but not across app launches.
// So every time we switch tab we'll also save the number of launches + the newly selected tab
// and every time the store rehydrates we'll check whether the number of launches is the same as the last
// time the app switched tab. if so, we reinstate the last selected tab.
const launchCount = ArtsyNativeModule.launchCount

function persistDevReloadState(tabType: BottomTabType) {
  if (!__DEV__) {
    return
  }
  setImmediate(() => {
    AsyncStorage.setItem(
      BOTTOM_NAV_STATE_STORAGE_KEY,
      JSON.stringify({
        launchCount,
        selectedTab: tabType,
      })
    )
  })
}
