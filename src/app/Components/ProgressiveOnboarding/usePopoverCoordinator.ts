import { useHasPresentedOverlay } from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { popoverTelemetry } from "app/Components/ProgressiveOnboarding/popoverTelemetry"
import { useShowDelay } from "app/Components/ProgressiveOnboarding/useShowDelay"
import { GlobalStore } from "app/store/GlobalStore"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { useCurrentRouteName } from "app/utils/hooks/useCurrentRouteName"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * How long a popover may hold the lock after being told to show without reporting that
 * it opened. Generous next to the 400ms open animation: this is a last resort, not a
 * timing knob.
 */
export const POPOVER_OPEN_TIMEOUT_MS = 3000

/** Grace period before a popover that stopped being displayable gives the lock back. */
export const POPOVER_RELEASE_GRACE_MS = 1500

interface UsePopoverCoordinatorArgs {
  id: ProgressiveOnboardingKey
  /** Everything the caller knows about whether this popover wants to be shown. */
  isDisplayable: boolean
  /** Delay before showing, to let layout settle. Hiding is never delayed. */
  delay?: number
}

/**
 * Owns the "one popover at a time" lock for a single popover, and recovers from the two
 * ways the underlying library leaves one stuck.
 *
 * Background: palette's `Popover` renders `react-native-popover-view` in its default
 * `RN_MODAL` mode, so every popover is a transparent full-screen native `<Modal>`. If
 * `isVisible` goes false before the bubble has measured and opened, the library only
 * sets `animateOutAfterShow` — if it never opens, the Modal stays mounted and swallows
 * every touch in the app. The library also refuses to open a second popover while one is
 * showing, but only `console.warn`s about it, so a refused popover never fires its
 * open/close callbacks either. In both cases the only recovery is to unmount it, which is
 * what `remountKey` is for.
 */
export const usePopoverCoordinator = ({
  id,
  isDisplayable,
  delay = 0,
}: UsePopoverCoordinatorArgs) => {
  const {
    sessionState: { activePopover },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { acquireActivePopover, releaseActivePopover } = GlobalStore.actions.progressiveOnboarding

  const hasPresentedOverlay = useHasPresentedOverlay()
  const currentRouteName = useCurrentRouteName()
  const [remountKey, setRemountKey] = useState(0)

  const isHolder = activePopover === id

  // The route this popover was asked to show for. If we end up somewhere else by the
  // time the delay elapses, the moment has passed — we drop the request rather than
  // deferring it, which is how popovers used to surface on the wrong screen.
  const anchorRouteRef = useRef(currentRouteName)
  if (!isDisplayable) {
    anchorRouteRef.current = currentRouteName
  }

  const isOnAnchorRoute = anchorRouteRef.current === currentRouteName

  // Never present on top of a modal, bottom sheet or overlay: ours would be a second
  // full-screen Modal above theirs.
  const canShow = isDisplayable && !hasPresentedOverlay && isOnAnchorRoute

  const release = useCallback(() => {
    releaseActivePopover(id)
  }, [id, releaseActivePopover])

  useEffect(() => {
    if (!canShow) {
      return
    }
    // Safe unconditionally: the reducer ignores this while someone else holds the lock,
    // so two popovers becoming displayable in the same commit cannot both win.
    acquireActivePopover(id)
  }, [acquireActivePopover, canShow, id])

  // Give the lock back once we no longer want it, after a grace period so a brief flicker
  // in `isDisplayable` doesn't hand the lock to a sibling mid-animation.
  useEffect(() => {
    if (canShow || !isHolder) {
      return
    }
    const timeout = setTimeout(release, POPOVER_RELEASE_GRACE_MS)
    return () => clearTimeout(timeout)
  }, [canShow, isHolder, release])

  const isVisible = useShowDelay(() => canShow && isHolder, delay)

  const hasOpenedRef = useRef(false)

  const forceRecover = useCallback(
    (reason: string) => {
      popoverTelemetry.watchdogFired(id, reason)
      hasOpenedRef.current = false
      release()
      // Remounting is the only way to unmount a Modal the library has left showing.
      setRemountKey((key) => key + 1)
    },
    [id, release]
  )

  // Watchdog: told to show, never reported open.
  useEffect(() => {
    if (!isVisible) {
      return
    }
    const timeout = setTimeout(() => {
      if (!hasOpenedRef.current) {
        forceRecover("never opened")
      }
    }, POPOVER_OPEN_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [forceRecover, isVisible])

  // Something was presented above us while we were open. We cannot stay.
  useEffect(() => {
    if (!hasPresentedOverlay || !hasOpenedRef.current) {
      return
    }
    forceRecover("overlay presented above an open popover")
  }, [forceRecover, hasPresentedOverlay])

  // Release on unmount. Without this, a popover whose host disappears (tab switch,
  // navigation, scroll) holds the lock for the rest of the session and silently kills
  // every popover that comes after it.
  const releaseRef = useRef(release)
  releaseRef.current = release
  useEffect(() => {
    return () => releaseRef.current()
  }, [])

  const onOpenStart = useCallback(() => {
    hasOpenedRef.current = true
  }, [])

  const onCloseComplete = useCallback(() => {
    hasOpenedRef.current = false
    release()
  }, [release])

  useEffect(() => {
    if (!isHolder) {
      return
    }
    popoverTelemetry.acquired(id)
    return () => popoverTelemetry.released(id)
  }, [id, isHolder])

  return { isVisible, remountKey, onOpenStart, onCloseComplete, release }
}
