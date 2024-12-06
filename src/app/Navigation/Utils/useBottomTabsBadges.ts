import { useColor, useSpace } from "@artsy/palette-mobile"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { bottomTabsConfig } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { useVisualClue } from "app/utils/hooks/useVisualClue"
import { useTabBarBadge } from "app/utils/useTabBarBadge"
import { StyleProp, TextStyle } from "react-native"

const VISUAL_CLUE_HEIGHT = 10

type BadgeProps = { badgeCount?: string | number; badgeStyle: StyleProp<TextStyle> }
/**
 * This hook is used to get badge details for each bottom tab
 * @returns an object with the badge count and style for each tab
 * @example { home: { badgeCount: 5, badgeStyle: { backgroundColor: "red" } }, search: { badgeCount: undefined, badgeStyle: {} } }
 */
export const useBottomTabsBadges = () => {
  const color = useColor()
  const space = useSpace()

  const { showVisualClue } = useVisualClue()

  const { unreadConversationsCount, hasUnseenNotifications } = useTabBarBadge()

  const tabsBadges: Record<string, BadgeProps> = {}

  const visualClueStyles = {
    backgroundColor: color("blue100"),
    top: space(1),
    minWidth: VISUAL_CLUE_HEIGHT,
    maxHeight: VISUAL_CLUE_HEIGHT,
    borderRadius: VISUAL_CLUE_HEIGHT / 2,
    borderColor: color("white100"),
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
      badgeCount: undefined,
      badgeStyle: {},
    }

    tabsBadges[tab] = defaultBadgeProps

    if (hasVisualCluesForTab(tab as BottomTabType)) {
      tabsBadges[tab] = {
        badgeCount: "",
        badgeStyle: {
          ...visualClueStyles,
        },
      }
    }

    switch (tab) {
      case "home": {
        if (hasUnseenNotifications) {
          tabsBadges[tab] = {
            badgeCount: "",
            badgeStyle: {
              ...visualClueStyles,
            },
          }
        }
        return
      }

      case "inbox": {
        if (unreadConversationsCount) {
          tabsBadges[tab] = {
            badgeCount: unreadConversationsCount,
            badgeStyle: {
              backgroundColor: color("red100"),
            },
          }
        }
        return
      }
    }
  })

  return { tabsBadges }
}
