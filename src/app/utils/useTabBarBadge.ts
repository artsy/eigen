import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import useInterval from "react-use/lib/useInterval"

export const FETCH_NOTIFICATIONS_INFO_INTERVAL = 60 * 1000 // every 60 seconds

export const useTabBarBadge = () => {
  const unreadConversationsCount = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.unreadCounts.conversations
  )
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  useEffect(() => {
    GlobalStore.actions.bottomTabs.fetchNotificationsInfo()
  }, [])

  useInterval(() => {
    GlobalStore.actions.bottomTabs.fetchNotificationsInfo()
    // run this every 60 seconds
  }, FETCH_NOTIFICATIONS_INFO_INTERVAL)

  return {
    unreadConversationsCount: unreadConversationsCount || undefined,
    hasUnseenNotifications,
  }
}
