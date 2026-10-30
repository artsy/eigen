import { useHasPresentedOverlay } from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { popoverTelemetry } from "app/Components/ProgressiveOnboarding/popoverTelemetry"
import { useAnchorSettled } from "app/Components/ProgressiveOnboarding/useAnchorSettled"
import { useShowDelay } from "app/Components/ProgressiveOnboarding/useShowDelay"
import { GlobalStore } from "app/store/GlobalStore"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { readCurrentRoute, useCurrentRoute } from "app/utils/hooks/useCurrentRoute"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { View } from "react-native"

/**
 * How long a popover may hold the lock after being told to show without reporting that
 * it opened. Generous next to the 400ms open animation: this is a last resort, not a
 * timing knob.
 */
export const POPOVER_OPEN_TIMEOUT_MS = 3000

/** Grace period before a popover that stopped being displayable gives the lock back. */
export const POPOVER_RELEASE_GRACE_MS = 1500

let instanceCount = 0

interface UsePopoverCoordinatorArgs {
  id: ProgressiveOnboardingKey
  /** The caller's own condition, already combined with "not yet dismissed". */
  isDisplayable: boolean
  /** Delay before showing. Hiding is never delayed. */
  delay?: number
  /** The popover's anchor. Showing waits for it to stop moving (see `useAnchorSettled`). */
  anchorRef?: RefObject<View | null>
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
  anchorRef,
}: UsePopoverCoordinatorArgs) => {
  const {
    sessionState: { activePopover },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { acquireActivePopover, releaseActivePopover } = GlobalStore.actions.progressiveOnboarding

  const hasPresentedOverlay = useHasPresentedOverlay()
  // The hook re-renders us when the route moves, but its copy can trail the navigator by
  // a render: `useIsFocused` re-renders synchronously on the focus event, ahead of the
  // batched "state" listener behind the hook, so a focus-gated popover can become
  // displayable while the hook still reports the screen we came from. Anchoring to that
  // would latch on the very next render.
  useCurrentRoute()
  const currentRoute = readCurrentRoute()
  const [remountKey, setRemountKey] = useState(0)

  // The lock is owned by this instance, not by the key: two mounted popovers can share a
  // key (artist screen over artist screen), and the covered one's release must not pull
  // the lock from under the one on top. The key stays in front for readability.
  const [instance] = useState(() => ++instanceCount)
  const owner = `${id}#${instance}`
  const isHolder = activePopover === owner

  // What we actually acquired, which is what we must release. The key can change while we
  // hold it: the alert reminder switches keys the moment reminder 1 is dismissed, and
  // releasing under the new key would leave the old one holding the lock for the session.
  const heldRef = useRef<{ owner: string; id: ProgressiveOnboardingKey } | undefined>(undefined)
  if (isHolder) {
    heldRef.current = { owner, id }
  }
  const heldId =
    activePopover && activePopover === heldRef.current?.owner ? heldRef.current.id : undefined

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
  const wasDisplayableRef = useRef(false)

  // Re-anchor on the render we become displayable too, not only while we are not: route
  // gated callers (`currentRoute === "Home"`) flip `isDisplayable` in the same render the
  // route changes, so the anchor would still hold the screen we just came back from.
  //
  // An undefined key means "we do not know yet" — the navigator can populate after our
  // first render — so we re-anchor rather than treating the change as a navigation.
  // Latching on that would permanently sink any popover already displayable at launch.
  if (!isDisplayable || !wasDisplayableRef.current || anchorRouteRef.current.key === undefined) {
    anchorRouteRef.current = currentRoute
    hasLeftAnchorRouteRef.current = false
  } else if (currentRoute.key !== undefined && anchorRouteRef.current.key !== currentRoute.key) {
    hasLeftAnchorRouteRef.current = true
  }
  wasDisplayableRef.current = isDisplayable

  // Never present on top of a modal, bottom sheet or overlay: ours would be a second
  // full-screen Modal above theirs.
  const wantsToShow = isDisplayable && !hasPresentedOverlay && !hasLeftAnchorRouteRef.current
  // Don't queue for the lock until the anchor is on screen and still. A popover whose anchor
  // has been scrolled away would otherwise hold the lock while it waits, and keep a sibling
  // whose anchor is in plain view from showing.
  const isAnchorReady = useAnchorSettled(anchorRef, wantsToShow)
  const canShow = wantsToShow && isAnchorReady

  const release = useCallback(() => {
    const held = heldRef.current
    if (!held) {
      return
    }
    heldRef.current = undefined
    releaseActivePopover(held.owner)
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
    acquireActivePopover(owner)
  }, [acquireActivePopover, activePopover, canShow, owner])

  // Pending from the moment we are told to show until the popover reports that it opened
  // or closed. Deliberately not cleared when `isVisible` goes false: hiding a bubble that
  // has not finished measuring only sets the library's `animateOutAfterShow`, and if the
  // measurement never completes its Modal stays mounted, swallowing every touch.
  const openWatchdogRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const clearOpenWatchdog = useCallback(() => {
    clearTimeout(openWatchdogRef.current)
    openWatchdogRef.current = undefined
  }, [])

  // Give the lock back once we no longer want it, after a grace period so a brief flicker
  // in `isDisplayable` doesn't hand the lock to a sibling mid-animation. Not while an open
  // is still pending: its Modal may be up, so the close or the watchdog releases instead.
  useEffect(() => {
    if (!heldId || (canShow && isHolder)) {
      return
    }
    const timeout = setTimeout(() => {
      if (!openWatchdogRef.current) {
        release()
      }
    }, POPOVER_RELEASE_GRACE_MS)
    return () => clearTimeout(timeout)
  }, [canShow, heldId, isHolder, release])

  const isDelayed = useShowDelay(() => canShow && isHolder, delay)
  // Checked again after the delay: the anchor can move while we wait. Before `isVisible`,
  // so the wait never eats into the watchdog.
  const isVisible = useAnchorSettled(anchorRef, isDelayed)

  // Open *completion*, not open start. The stuck case we are guarding against is a
  // popover that begins opening and never finishes measuring, so keying the watchdog off
  // `onOpenStart` would have made it blind to exactly that.
  const hasOpenedRef = useRef(false)

  const forceRecover = useCallback(() => {
    clearOpenWatchdog()
    hasOpenedRef.current = false
    hasGivenUpRef.current = true
    release()
    // Remounting is the only way to unmount a Modal the library has left showing.
    setRemountKey((key) => key + 1)
  }, [clearOpenWatchdog, release])

  useEffect(() => {
    if (!isVisible || hasOpenedRef.current || openWatchdogRef.current) {
      return
    }
    openWatchdogRef.current = setTimeout(() => {
      openWatchdogRef.current = undefined
      // Covers every way this goes wrong: the library silently refusing to open a second
      // popover (it only console.warns), and a bubble that never finishes measuring,
      // whether or not we have since been hidden. None of them fires a callback.
      popoverTelemetry.watchdogFired(id, "never finished opening")
      forceRecover()
    }, POPOVER_OPEN_TIMEOUT_MS)
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
    return () => {
      clearOpenWatchdog()
      release()
    }
  }, [clearOpenWatchdog, release])

  const onOpenComplete = useCallback(() => {
    clearOpenWatchdog()
    hasOpenedRef.current = true
  }, [clearOpenWatchdog])

  const onCloseComplete = useCallback(() => {
    clearOpenWatchdog()
    hasOpenedRef.current = false
    release()
  }, [clearOpenWatchdog, release])

  useEffect(() => {
    if (!heldId) {
      return
    }
    popoverTelemetry.acquired(heldId)
    return () => popoverTelemetry.released(heldId)
  }, [heldId])

  return { isVisible, remountKey, onOpenComplete, onCloseComplete, release }
}
