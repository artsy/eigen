import { addBreadcrumb } from "@sentry/react-native"
import { SENTRY_TAG_NONE, setSentryActivePopoverTag } from "app/system/errorReporting/sentryTags"

const CATEGORY = "popover"

/**
 * Observability for the popover lock.
 *
 * Why this is needed at all: a stuck popover is an invisible full-screen `<Modal>` that
 * swallows touches while the JS and main threads stay perfectly responsive. Nothing
 * crashes and nothing hangs, so Sentry's app-hang/ANR detection cannot see it — which is
 * why we have never had a number for how many users hit it. Any signal has to be
 * deliberate.
 *
 * The tag gives attribution on events that are already being sent; the breadcrumbs give
 * the lock's recent history inside whatever gets reported next.
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
   * The watchdog fired: the popover held the lock but never reported itself open, so we
   * force-released it and remounted to unmount a potentially stuck Modal. This is the
   * one event worth counting — it is the closest thing we have to "a user was affected".
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
