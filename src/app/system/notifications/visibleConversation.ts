/**
 * Helpers for deciding whether an incoming message notification is for the
 * conversation the user is already reading, in which case there's no point
 * interrupting them with a banner.
 *
 * Kept free of navigation imports so both the navigation container (which
 * publishes the visible conversation to native for iOS) and the Android
 * notification listener can use them without a circular dependency.
 */

/**
 * The conversation the given route is showing, or "" when it isn't a
 * conversation thread. `ConversationDetails` deliberately doesn't count: the
 * thread itself isn't on screen there.
 */
export const conversationIDFromRoute = (route?: {
  name?: string
  params?: object | undefined
}): string => {
  if (route?.name !== "Conversation") {
    return ""
  }

  return (route.params as { conversationID?: string })?.conversationID ?? ""
}

/**
 * The conversation a notification's deep link points at, or null when it isn't
 * a conversation link. Matches both /conversation/:id (with or without a
 * trailing segment like /details) and /user/conversations/:id, on relative
 * paths as well as full artsy.net urls.
 */
export const conversationIDFromURL = (url: string | null | undefined): string | null => {
  if (!url) {
    return null
  }

  return url.match(/\/conversations?\/([^/?#]+)/)?.[1] ?? null
}
