import { Action, action, Thunk, thunk } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { navigate, navigationEvents } from "lib/navigation/navigate"
import { GlobalStore, unsafe_getFeatureFlag } from "./GlobalStore"

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
      type: "MODAL_DISMISSED"
    }

export interface NativeState {
  userID: string
  userEmail: string
  authenticationToken: string
  launchCount: number
  onboardingState: "none" | "incomplete" | "complete"
  userAgent: string
  deviceId: string
}

export interface NativeModel {
  sessionState: NativeState
  setLocalState: Action<NativeModel, Partial<NativeState>>
  setApplicationIconBadgeNumber: Thunk<NativeModel, number>
}

export const getNativeModel = (): NativeModel => ({
  sessionState: LegacyNativeModules.ARNotificationsManager?.nativeState ?? {},
  setLocalState: action((state, nextNativeState) => {
    Object.assign(state.sessionState, nextNativeState)
  }),
  setApplicationIconBadgeNumber: thunk((_actions, count) => {
    LegacyNativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber(count)
  }),
})

export function listenToNativeEvents(cb: (event: NativeEvent) => void) {
  return NotificationsManager.addListener("event", cb)
}

listenToNativeEvents((event: NativeEvent) => {
  switch (event.type) {
    case "STATE_CHANGED":
      GlobalStore.actions.native.setLocalState(event.payload)
      if (!unsafe_getFeatureFlag("AREnableNewOnboardingFlow") && event.payload.userEmail !== null) {
        GlobalStore.actions.auth.setState({ userEmail: event.payload.userEmail })
      }
      return
    case "NOTIFICATION_RECEIVED":
      GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
      return
    case "REQUEST_NAVIGATION":
      const { route, props } = event.payload
      navigate(route, { passProps: props })
      return
    case "MODAL_DISMISSED":
      navigationEvents.emit("modalDismissed")
      return
    default:
      assertNever(event)
  }
})
