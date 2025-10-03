import { NotificationsManager } from "app/NativeModules/NotificationsManager"
import { GlobalStore } from "app/store/GlobalStore"
import { NativeEvent } from "app/store/NativeModel"
// eslint-disable-next-line no-restricted-imports
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"

export function listenToNativeEvents(cb: (event: NativeEvent) => void) {
  return NotificationsManager.addListener("event", cb)
}

listenToNativeEvents((event: NativeEvent) => {
  switch (event.type) {
    case "IDENTIFY_TRACKING":
      // Segment should automatically stitch identify calls to existing user even if userid is null
      SegmentTrackingProvider.identify
        ? SegmentTrackingProvider.identify(undefined, event.payload)
        : (() => undefined)()
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
      navigationEvents.emit("requestModalDismiss")
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
