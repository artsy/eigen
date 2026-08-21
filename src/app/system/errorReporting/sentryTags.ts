import { setTag } from "@sentry/react-native"

/**
 * Tags we attach to the Sentry scope ourselves, so crashes can be attributed to a
 * screen or an open bottom sheet without reading breadcrumbs event by event.
 *
 * Why tags and not `transaction`: our worst scroll/animation crashes (e.g. EIGEN-AZKQ)
 * are native `cpp_exception` events captured by sentry-cocoa. The JS `beforeSend` hook
 * never runs for those, and the RN SDK doesn't sync the scope's transaction name to the
 * native layer — it only syncs user, tags, contexts and breadcrumbs (see
 * `@sentry/react-native/dist/js/scopeSync.js`). Tags are therefore the only searchable
 * scope data that survives into a native crash report.
 */
export const SENTRY_TAGS = {
  route: "route",
  bottomSheet: "bottom_sheet",
} as const

/**
 * Tag values must be <= 200 chars and free of newlines, so keep them to plain names.
 * We clear with an explicit value rather than `undefined`: the native bridge types
 * `setTag(key, value: string)` as non-nullable, and an empty tag is indistinguishable
 * from "we never set it" when searching in Sentry.
 */
export const SENTRY_TAG_NONE = "none"

export const setSentryRouteTag = (routeName: string | undefined) => {
  setTag(SENTRY_TAGS.route, routeName ?? "unknown")
}

export const setSentryBottomSheetTag = (name: string) => {
  setTag(SENTRY_TAGS.bottomSheet, name)
}
