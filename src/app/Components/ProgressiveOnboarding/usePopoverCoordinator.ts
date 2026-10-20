import { useHasPresentedOverlay } from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { popoverTelemetry } from "app/Components/ProgressiveOnboarding/popoverTelemetry"
import { useShowDelay } from "app/Components/ProgressiveOnboarding/useShowDelay"
import { GlobalStore } from "app/store/GlobalStore"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { useCurrentRoute } from "app/utils/hooks/useCurrentRoute"
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
  /** The caller's own condition, already combined with "not yet dismissed". */
  isDisplayable: boolean
  /** Delay before showing. Hiding is never delayed. */
  delay?: number
}

/**
 * Owns the "one popover at a time" lock for a single popover, and recovers from the two
 * ways the underlying library leaves one stuck: a bubble that never finishes measuring,
 * and a second popover the library silently refuses to open. Neither fires any callback,
 * and the only recovery for either is to unmount — which is what `remountKey` is for.
 *
 * See `docs/popovers.md` for why a popover is a full-screen native `<Modal>` at all.
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
  const currentRoute = useCurrentRoute()
  const [remountKey, setRemountKey] = useState(0)

  const isHolder = activePopover === id

  // The id we actually acquired, which is what we must release. It can differ from `id`:
  // the alert reminder switches keys the moment reminder 1 is dismissed, and releasing
  // under the new key would leave the old one holding the lock for the whole session.
  const heldIdRef = useRef<ProgressiveOnboardingKey | undefined>(undefined)
  if (isHolder) {
    heldIdRef.current = id
  }
  const heldId = activePopover && activePopover === heldIdRef.current ? activePopover : undefined

  // The route this popover was asked to show for. Compared by key, not name: pushing a
  // second screen of the same type (artist over artist) leaves the name identical, and
  // our popover is a full-screen Modal that would render above the new screen quite
  // happily.
  const anchorRouteRef = useRef(currentRoute)

  // Latches once we leave that route. Navigating back does not revive the request: the
  // popover belongs to a moment, and by now the user is several screens and possibly
  // minutes past it. Both reset when the popover stops being displayable, so a fresh
  // visit to the screen gets a fresh chance.
  const hasLeftAnchorRouteRef = useRef(false)

  // An undefined key means "we do not know yet" — the navigator can populate after our
  // first render — so we re-anchor rather than treating the change as a navigation.
  // Latching on that would permanently sink any popover already displayable at launch.
  if (!isDisplayable || anchorRouteRef.current.key === undefined) {
    anchorRouteRef.current = currentRoute
    hasLeftAnchorRouteRef.current = false
  } else if (currentRoute.key !== undefined && anchorRouteRef.current.key !== currentRoute.key) {
    hasLeftAnchorRouteRef.current = true
  }

  // Never present on top of a modal, bottom sheet or overlay: ours would be a second
  // full-screen Modal above theirs.
  const canShow = isDisplayable && !hasPresentedOverlay && !hasLeftAnchorRouteRef.current

  const release = useCallback(() => {
    const idToRelease = heldIdRef.current
    if (!idToRelease) {
      return
    }
    heldIdRef.current = undefined
    releaseActivePopover(idToRelease)
  }, [releaseActivePopover])

  // Set by the watchdog so a popover that failed to open doesn't immediately re-acquire
  // the lock it was just stripped of. Cleared once it stops being showable, so a later,
  // separate chance to show still gets taken.
  const hasGivenUpRef = useRef(false)
  if (!canShow) {
    hasGivenUpRef.current = false
  }

  // Re-runs whenever the lock changes hands, so a popover that became showable while a
  // sibling was still closing (the next step of a chain) takes the lock once it's free.
  useEffect(() => {
    if (!canShow || activePopover || hasGivenUpRef.current) {
      return
    }
    // The reducer still checks ownership, so two popovers becoming showable in the same
    // commit cannot both win.
    acquireActivePopover(id)
  }, [acquireActivePopover, activePopover, canShow, id])

  // Give the lock back once we no longer want it, after a grace period so a brief flicker
  // in `isDisplayable` doesn't hand the lock to a sibling mid-animation.
  useEffect(() => {
    if (!heldId || (canShow && isHolder)) {
      return
    }
    const timeout = setTimeout(release, POPOVER_RELEASE_GRACE_MS)
    return () => clearTimeout(timeout)
  }, [canShow, heldId, isHolder, release])

  const isVisible = useShowDelay(() => canShow && isHolder, delay)

  // Open *completion*, not open start. The stuck case we are guarding against is a
  // popover that begins opening and never finishes measuring, so keying the watchdog off
  // `onOpenStart` would have made it blind to exactly that.
  const hasOpenedRef = useRef(false)

  const forceRecover = useCallback(() => {
    hasOpenedRef.current = false
    hasGivenUpRef.current = true
    release()
    // Remounting is the only way to unmount a Modal the library has left showing.
    setRemountKey((key) => key + 1)
  }, [release])

  useEffect(() => {
    if (!isVisible) {
      return
    }
    const timeout = setTimeout(() => {
      if (!hasOpenedRef.current) {
        // Covers both ways this goes wrong: the library silently refusing to open a
        // second popover (it only console.warns), and a bubble that starts opening and
        // never finishes. Neither fires `onOpenComplete`.
        popoverTelemetry.watchdogFired(id, "never finished opening")
        forceRecover()
      }
    }, POPOVER_OPEN_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [forceRecover, id, isVisible])

  // Something was presented above us while we were open. We cannot stay.
  useEffect(() => {
    if (!hasPresentedOverlay || !hasOpenedRef.current) {
      return
    }
    popoverTelemetry.coveredByOverlay(id)
    forceRecover()
  }, [forceRecover, hasPresentedOverlay, id])

  // Release on unmount. Without this, a popover whose host disappears (tab switch,
  // navigation, scroll) holds the lock for the rest of the session and silently kills
  // every popover that comes after it.
  useEffect(() => {
    return () => release()
  }, [release])

  const onOpenComplete = useCallback(() => {
    hasOpenedRef.current = true
  }, [])

  const onCloseComplete = useCallback(() => {
    hasOpenedRef.current = false
    release()
  }, [release])

  useEffect(() => {
    if (!heldId) {
      return
    }
    popoverTelemetry.acquired(heldId)
    return () => popoverTelemetry.released(heldId)
  }, [heldId])

  return { isVisible, remountKey, onOpenComplete, onCloseComplete, release }
}
