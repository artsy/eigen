import { action, Action, State } from "easy-peasy"
import { NativeModules } from "react-native"
import { NativeState } from "./AppStoreNativeBridge"

// Eventually this file will mostly will be pulling in global state modules from other parts of the app
export interface AppStoreModel {
  nativeState: NativeState & {
    changed: Action<AppStoreModel["nativeState"], NativeState>
  }
  unreadMessagesCount: number
}

export const appStoreModel: AppStoreModel = {
  nativeState: {
    selectedTab: "home",
    ...(NativeModules.ARNotificationsManager.nativeState as {}), // to avoid `any` from leaking in here
    changed: action((nativeState, nextNativeState) => {
      Object.assign(nativeState, nextNativeState)
    }),
  },
  unreadMessagesCount: 0,
}

export type AppStoreState = State<AppStoreModel>
