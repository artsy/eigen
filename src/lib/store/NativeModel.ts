import { Action, action, Thunk, thunk } from "easy-peasy"
import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { EmissionOptions, NativeModules } from "react-native"
import { AppStore } from "./AppStore"

// These should match the values in emission/Pod/Classes/EigenCommunications/ARNotificationsManager.m
export type NativeEvent =
  | {
      type: "STATE_CHANGED"
      payload: NativeState
    }
  | {
      type: "NOTIFICATION_RECEIVED"
      payload: any
    }

export interface NativeState {
  selectedTab: BottomTabType
  emissionOptions: EmissionOptions
}

export interface NativeModel extends NativeState {
  setLocalState: Action<NativeModel, NativeState>
  setApplicationIconBadgeNumber: Thunk<NativeModel, number>
}

export const NativeModel: NativeModel = {
  ...NativeModules.ARNotificationsManager.nativeState,

  setLocalState: action((nativeState, nextNativeState) => {
    Object.assign(nativeState, nextNativeState)
  }),
  setApplicationIconBadgeNumber: thunk((_actions, count) => {
    NativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber(count)
  }),
}

export function listenToNativeEvents(cb: (event: NativeEvent) => void) {
  return NotificationsManager.addListener("event", cb)
}

listenToNativeEvents((event: NativeEvent) => {
  switch (event.type) {
    case "STATE_CHANGED":
      AppStore.actions.native.setLocalState(event.payload)
      return
    case "NOTIFICATION_RECEIVED":
      AppStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
      return
  }
})
