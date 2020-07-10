import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"

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
}

export function listenOnEigenNativeBridge(cb: (event: NativeEvent) => any) {
  return NotificationsManager.addListener("event", cb)
}
