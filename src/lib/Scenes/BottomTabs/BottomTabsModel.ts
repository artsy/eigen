import AsyncStorage from "@react-native-community/async-storage"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { Action, action, Thunk, thunk, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import type { GlobalStoreModel } from "lib/store/GlobalStoreModel"
import { NativeModules, Platform } from "react-native"
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
  __dev__didRehydrate: ThunkOn<BottomTabsModel, {}, GlobalStoreModel>
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
  __dev__didRehydrate: thunkOn((_, storeActions) => storeActions.rehydrate, maybeHandleDevReload),
}

// We want the selected tab state to persist across dev reloads, but not across app launches.
// So every time we switch tab we'll also save the number of launches + the newly selected tab
// and every time the store rehydrates we'll check whether the number of launches is the same as the last
// time the app switched tab. if so, we reinstate the last selected tab.
const reloadStateKey = "__dev__reloadState"

function persistDevReloadState(tabType: BottomTabType) {
  if (!__DEV__) {
    return
  }
  setImmediate(() => {
    AsyncStorage.setItem(
      reloadStateKey,
      JSON.stringify({
        launchCount,
        selectedTab: tabType,
      })
    )
  })
}

const launchCount =
  Platform.OS === "ios"
    ? LegacyNativeModules.ARNotificationsManager.nativeState.launchCount
    : NativeModules.ArtsyNativeModule.getConstants().launchCount

async function maybeHandleDevReload() {
  if (!__DEV__) {
    return
  }
  const json = await AsyncStorage.getItem(reloadStateKey)
  if (!json) {
    return
  }
  try {
    const { launchCount: previousLaunchCount, selectedTab } = JSON.parse(json)
    if (launchCount === previousLaunchCount) {
      GlobalStore.actions.bottomTabs.switchTab(selectedTab)
    } else {
      AsyncStorage.removeItem(reloadStateKey)
    }
  } catch (e) {
    console.error("failed to handle dev reload state")
  }
}
