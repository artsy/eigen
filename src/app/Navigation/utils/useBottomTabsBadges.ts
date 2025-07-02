import { useColor } from "@artsy/palette-mobile"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { bottomTabsConfig } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { useVisualClue } from "app/utils/hooks/useVisualClue"
import { useTabBarBadge } from "app/utils/useTabBarBadge"
import { StyleProp, TextStyle } from "react-native"

const VISUAL_CLUE_HEIGHT = 10

type BadgeProps = { tabBarBadge?: string | number; tabBarBadgeStyle: StyleProp<TextStyle> }
/**
 * This hook is used to get badge details for each bottom tab
 * @returns an object with the badge count and style for each tab
 * @example { home: { badgeCount: 5, badgeStyle: { backgroundColor: "red" } }, search: { badgeCount: undefined, badgeStyle: {} } }
 */
export const useBottomTabsBadges = () => {
  const color = useColor()

  const { showVisualClue } = useVisualClue()
  const { unreadConversationsCount, hasUnseenNotifications } = useTabBarBadge()

  const tabsBadges: Record<string, BadgeProps> = {}

  const visualClueStyles = {
    backgroundColor: color("blue100"),
    top: 2,
    minWidth: VISUAL_CLUE_HEIGHT,
    maxHeight: VISUAL_CLUE_HEIGHT,
    borderRadius: VISUAL_CLUE_HEIGHT / 2,
    borderColor: color("mono0"),
    borderWidth: 1,
  }

  const hasVisualCluesForTab = (tab: BottomTabType) => {
    const visualClues = bottomTabsConfig[tab].visualClues
    if (!visualClues) {
      return false
    }

    return visualClues?.find(showVisualClue)
  }

  Object.keys(bottomTabsConfig).forEach((tab) => {
    const defaultBadgeProps: BadgeProps = {
      tabBarBadge: undefined,
      tabBarBadgeStyle: {},
    }

    tabsBadges[tab] = defaultBadgeProps

    if (hasVisualCluesForTab(tab as BottomTabType)) {
      tabsBadges[tab] = {
        tabBarBadge: "",
        tabBarBadgeStyle: {
          ...visualClueStyles,
        },
      }
    }

    switch (tab) {
      case "home": {
        if (hasUnseenNotifications) {
          tabsBadges[tab] = {
            tabBarBadge: "",
            tabBarBadgeStyle: {
              ...visualClueStyles,
            },
          }
        }
        return
      }

      case "inbox": {
        if (unreadConversationsCount) {
          tabsBadges[tab] = {
            tabBarBadge: unreadConversationsCount,
            tabBarBadgeStyle: {
              ...visualClueStyles,
            },
          }
        }
        return
      }
    }
  })

  return { tabsBadges }
}
