import { Action, action, Thunk, thunk } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { navigate, navigationEvents } from "lib/navigation/navigate"
import { InfoType } from "lib/utils/track/providers"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { getCurrentEmissionState, GlobalStore, unsafe_getFeatureFlag } from "./GlobalStore"

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
    case "IDENTIFY_TRACKING":
      // Segment should automatically stitch identify calls to existing user even if userid is null
      SegmentTrackingProvider.identify ? SegmentTrackingProvider.identify(null, event.payload) : (() => undefined)()
      return
    case "EVENT_TRACKING":
      SegmentTrackingProvider.postEvent(event.payload)
      return
    case "STATE_CHANGED":
      const newOnboardingFlow = unsafe_getFeatureFlag("AREnableNewOnboardingFlow")
      if (!newOnboardingFlow) {
        const prevState = getCurrentEmissionState()
        const onboardingChanged =
          prevState.onboardingState !== "complete" && event.payload.onboardingState === "complete"
        const userIdChanged = !prevState.userID && event.payload.userID
        if (onboardingChanged || userIdChanged) {
          // weird ts-lint no-unused-expressions lint
          SegmentTrackingProvider.identify
            ? SegmentTrackingProvider.identify(event.payload.userID, {
                is_temporary_user: !event.payload.userID ? 1 : 0,
              })
            : (() => undefined)()
        }
      }
      GlobalStore.actions.native.setLocalState(event.payload)
      if (!newOnboardingFlow && event.payload.userEmail !== null) {
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
