import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { NotificationsManager } from "app/NativeModules/NotificationsManager"
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"
import { InfoType } from "app/utils/track/providers"
import { Action, action, Thunk, thunk } from "easy-peasy"
import { GlobalStore } from "./GlobalStore"

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
    case "IDENTIFY_TRACKING":
      // Segment should automatically stitch identify calls to existing user even if userid is null
      // SegmentTrackingProvider.identify
      //   ? SegmentTrackingProvider.identify(null, event.payload)
      //   : (() => undefined)()
      return
    case "EVENT_TRACKING":
      SegmentTrackingProvider.postEvent(event.payload)
      return
    case "STATE_CHANGED":
      // We need to set the values we get from the native state on iOS to the global store
      // to have parity between the auth on native and react-native
      if (event.payload.userEmail && event.payload.userID && event.payload.authenticationToken) {
        GlobalStore.actions.auth.setState({
          userEmail: event.payload.userEmail,
          userAccessToken: event.payload.authenticationToken,
          userID: event.payload.userID,
        })
      }

      return
    case "NOTIFICATION_RECEIVED":
      GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
      return
    case "REQUEST_NAVIGATION": {
      const { route, props } = event.payload
      navigate(route, { passProps: props })
      return
    }
    case "MODAL_DISMISSED":
      navigationEvents.emit("modalDismissed")
      return
    case "REQUEST_MODAL_DISMISS":
      navigationEvents.emit("requestModalDismiss")
      return
    default:
      assertNever(event)
  }
})
