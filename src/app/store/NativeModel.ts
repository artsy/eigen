import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
// This event listener needs to be imported so that the event listeners are setup before the app is mounted
// @ts-ignore
import "app/NativeModules/utils/listenToNativeEvents"
import { InfoType } from "app/utils/track/providers"
import { Action, action, Thunk, thunk } from "easy-peasy"

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
  | {
      type: "REQUEST_NAVIGATION"
      payload: { route: string; props: {} }
    }
  | {
      type: "REQUEST_MODAL_DISMISS"
    }
  | {
      type: "MODAL_DISMISSED"
    }
  | {
      type: "EVENT_TRACKING"
      payload: InfoType
    }
  | {
      type: "IDENTIFY_TRACKING"
      payload: InfoType
    }

export interface NativeState {
  userID: string
  userEmail: string
  authenticationToken: string
  launchCount: number
  userAgent: string
}

export interface NativeModel {
  sessionState: NativeState
  setLocalState: Action<NativeModel, Partial<NativeState>>
  setApplicationIconBadgeNumber: Thunk<NativeModel, number>
}

export const getNativeModel = (): NativeModel => ({
  sessionState: LegacyNativeModules.ARNotificationsManager.getConstants(),
  setLocalState: action((state, nextNativeState) => {
    Object.assign(state.sessionState, nextNativeState)
  }),
  setApplicationIconBadgeNumber: thunk((_actions, count) => {
    LegacyNativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber(count)
  }),
})
