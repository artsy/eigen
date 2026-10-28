import { addBreadcrumb } from "@sentry/react-native"
import { SENTRY_TAG_NONE, setSentryActivePopoverTag } from "app/system/errorReporting/sentryTags"

const CATEGORY = "popover"

/**
 * Observability for the popover lock.
 *
 * A stuck popover blocks touches without hanging either thread, so app-hang detection
 * cannot see it and any signal has to be deliberate. The tag attributes events that are
 * already being sent; the breadcrumbs carry the lock's recent history into whatever gets
 * reported next. Neither is a count of affected users — see `docs/popovers.md`.
 */
export const popoverTelemetry = {
  acquired: (id: string) => {
    setSentryActivePopoverTag(id)
    addBreadcrumb({ category: CATEGORY, message: `acquired ${id}`, level: "info" })
  },

  released: (id: string) => {
    setSentryActivePopoverTag(SENTRY_TAG_NONE)
    addBreadcrumb({ category: CATEGORY, message: `released ${id}`, level: "info" })
  },

  /**
   * A modal or bottom sheet was presented above an open popover, so it was closed and
   * remounted. Expected behaviour, kept apart from `watchdogFired` so that stays a count
   * of genuinely stuck popovers.
   */
  coveredByOverlay: (id: string) => {
    setSentryActivePopoverTag(SENTRY_TAG_NONE)
    addBreadcrumb({ category: CATEGORY, message: `covered by overlay ${id}`, level: "info" })
  },

  /**
   * The popover held the lock but never reported itself open, so it was force-released
   * and remounted to unmount a potentially stuck Modal.
   */
  watchdogFired: (id: string, reason: string) => {
    setSentryActivePopoverTag(SENTRY_TAG_NONE)
    addBreadcrumb({
      category: CATEGORY,
      message: `watchdog ${id}: ${reason}`,
      level: "warning",
    })
  },
}
