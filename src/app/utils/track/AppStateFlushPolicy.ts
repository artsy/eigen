import { FlushPolicyBase } from "@segment/analytics-react-native"
import { AppState, AppStateStatus, NativeEventSubscription } from "react-native"

/**
 * Flushes the Segment queue as soon as the app leaves the foreground.
 *
 * The default policies (20 events / 30s of inactivity) leave the tail of short sessions,
 * e.g. a push tap or a first launch, on the device until the next launch. Since
 * analytics-react-native 2.24 those events are dropped when that launch is more than
 * `maxTotalBackoffDuration` later, so we upload them while the app is still running.
 */
export class AppStateFlushPolicy extends FlushPolicyBase {
  private subscription?: NativeEventSubscription

  start() {
    this.subscription = AppState.addEventListener("change", this.handleAppStateChange)
  }

  onEvent() {
    // Flushing is driven by app state changes only
  }

  end() {
    this.subscription?.remove()
    this.subscription = undefined
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    // iOS reports "inactive" before "background", which gives the upload a head start
    if (nextAppState === "inactive" || nextAppState === "background") {
      this.shouldFlush.value = true
    }
  }
}
