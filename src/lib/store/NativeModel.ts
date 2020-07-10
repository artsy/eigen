import { Action, action } from "easy-peasy"
import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { NativeModules } from "react-native"
import { AppStore } from "./AppStore"

// These should match the values in emission/Pod/Classes/EigenCommunications/ARNotificationsManager.m
type NativeEvent =
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
}

export interface NativeModel extends NativeState {
  setState: Action<NativeModel, NativeState>
}

export const NativeModel: NativeModel = {
  ...NativeModules.ARNotificationsManager.nativeState,

  setState: action((nativeState, nextNativeState) => {
    Object.assign(nativeState, nextNativeState)
  }),
}

NotificationsManager.addListener("event", (event: NativeEvent) => {
  switch (event.type) {
    case "STATE_CHANGED":
      AppStore.actions.native.setState(event.payload)
      return
    case "NOTIFICATION_RECEIVED":
      return
  }
})
