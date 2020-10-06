import { Action, action, Thunk, thunk } from "easy-peasy"
import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { navigate } from "lib/navigation/navigate"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { NativeModules } from "react-native"
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
  | {
      type: "RESET_APP_STATE"
      payload: NativeState
    }
  | {
      type: "REQUEST_NAVIGATION"
      payload: { route: string }
    }

export interface NativeState {
  selectedTab: BottomTabType
  userID: string
  authenticationToken: string
  launchCount: number
  onboardingState: "none" | "incomplete" | "complete"

  gravityURL: string
  metaphysicsURL: string
  predictionURL: string
  webURL: string
  userAgent: string

  env: "production" | "staging" | "test"
  deviceId: string

  // Empty is falsy in JS, so these are fine too.
  stripePublishableKey: string
  sentryDSN: string
  options: {
    AROptionsBidManagement: boolean
    AROptionsEnableMyCollection: boolean
    AROptionsLotConditionReport: boolean
    AROptionsPriceTransparency: boolean
    AROptionsNewSalePage: boolean
    AROptionsViewingRooms: boolean
    AREnableViewingRooms: boolean
    ipad_vir: boolean
    iphone_vir: boolean
    ARDisableReactNativeBidFlow: boolean
    AREnableNewPartnerView: boolean
    AROptionsArtistSeries: boolean
    AROptionsNewFirstInquiry: boolean
    AROptionsUseReactNativeWebView: boolean
    AROptionsNewShowPage: boolean
    AROptionsNewFairPage: boolean
  }
  legacyFairSlugs: string[]
  legacyFairProfileSlugs: string[]
}

export type EmissionOptions = NativeState["options"]

export interface NativeModel {
  sessionState: NativeState
  setLocalState: Action<NativeModel, Partial<NativeState>>
  setApplicationIconBadgeNumber: Thunk<NativeModel, number>
}

export const NativeModel: NativeModel = {
  sessionState: NativeModules.ARNotificationsManager.nativeState,
  setLocalState: action((state, nextNativeState) => {
    Object.assign(state.sessionState, nextNativeState)
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
    case "RESET_APP_STATE":
      AppStore.actions.reset()
      AppStore.actions.native.setLocalState(event.payload)
      return
    case "REQUEST_NAVIGATION":
      navigate(event.payload.route)
      return
    default:
      assertNever(event)
  }
})
