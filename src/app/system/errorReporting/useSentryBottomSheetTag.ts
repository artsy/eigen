import { SENTRY_TAG_NONE, setSentryBottomSheetTag } from "app/system/errorReporting/sentryTags"
import { useEffect } from "react"

/**
 * Tags Sentry events with the bottom sheet that is currently open.
 *
 * Bottom sheets are overlays, so the navigation route stays the same whichever sheet is
 * up — the `route` tag alone can't tell us which sheet a crash came from. Several of our
 * crashes live specifically in sheet scrollables (gorhom's scroll correction fighting
 * another animated scroll handler, EIGEN-AZKQ), so sheet identity is the attribution we
 * actually need.
 *
 * @param name Stable, human-readable sheet name. Keep it aligned with the component name.
 * @param isOpen Whether the sheet is currently presented (or expanded, for sheets that
 *   stay mounted at a collapsed detent).
 */
export const useSentryBottomSheetTag = (name: string | undefined, isOpen: boolean) => {
  useEffect(() => {
    if (!name || !isOpen) {
      return
    }

    setSentryBottomSheetTag(name)

    // Tags live on the isolation scope, which in React Native is global for the whole
    // app lifetime — there's no per-request isolation to fall out of. Without this
    // cleanup a closed sheet's name stays attached to every later event.
    return () => setSentryBottomSheetTag(SENTRY_TAG_NONE)
  }, [name, isOpen])
}
