import { tappedTabBar } from "@artsy/cohesion"
import { Flex, PopIn, Text, Touchable, VisualClueDot, useColor } from "@artsy/palette-mobile"
import { ProgressiveOnboardingFindSavedArtwork } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingFindSavedArtwork"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { unsafe__getSelectedTab } from "app/store/GlobalStore"
import { VisualClueName } from "app/store/config/visualClues"
import { switchTab } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { useVisualClue } from "app/utils/hooks/useVisualClue"
import { useTabBarBadge } from "app/utils/useTabBarBadge"
import { useMemo } from "react"
import { GestureResponderEvent, LayoutAnimation, View } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { BottomTabOption, BottomTabType } from "./BottomTabType"
import { BottomTabsIcon, ICON_HEIGHT, ICON_WIDTH } from "./BottomTabsIcon"
import { bottomTabsConfig } from "./bottomTabsConfig"

export interface BottomTabsButtonProps {
  tab: BottomTabType
  badgeCount?: number
  visualClue?: VisualClueName
  forceDisplayVisualClue?: boolean
  onPress?: (e: GestureResponderEvent) => void
}

export const BOTTOM_TABS_TEXT_HEIGHT = 15

// TODO: Improve this component once we remove enableNewNavigation feature flag
// There are too many rerenders happening in this component
export const BottomTabsButton: React.FC<BottomTabsButtonProps> = ({
  tab,
  badgeCount: badgeCountProp = 0,
  visualClue,
  forceDisplayVisualClue: forceDisplayVisualClueProp,
  ...buttonProps
}) => {
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

  const selectedTab = useSelectedTab()
  const color = useColor()

  const isActive = selectedTab === tab

  const { unreadConversationsCount, hasUnseenNotifications } = useTabBarBadge()

  const forceDisplayVisualClue = useMemo(() => {
    if (!enableNewNavigation) {
      return forceDisplayVisualClueProp
    }

    if (tab === "home") {
      return hasUnseenNotifications
    }

    return false
  }, [hasUnseenNotifications, forceDisplayVisualClueProp])

  const badgeCount = useMemo(() => {
    if (!enableNewNavigation) {
      return badgeCountProp
    }

    if (tab === "inbox") {
      return unreadConversationsCount ?? 0
    }

    return 0
  }, [unreadConversationsCount, badgeCountProp])

  const { showVisualClue } = useVisualClue()

  const tracking = useTracking()
  const isStaging = useIsStaging()

  const onPress = (e: GestureResponderEvent) => {
    if (enableNewNavigation) {
      buttonProps.onPress?.(e)
      tracking.trackEvent(
        tappedTabBar({
          tab: bottomTabsConfig[tab].analyticsDescription,
          badge: badgeCount > 0,
          contextScreenOwnerType: BottomTabOption[selectedTab],
        })
      )

      return
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (tab === unsafe__getSelectedTab()) {
      LegacyNativeModules.ARScreenPresenterModule.popToRootOrScrollToTop(tab)
    } else {
      switchTab(tab)
    }
    tracking.trackEvent(
      tappedTabBar({
        tab: bottomTabsConfig[tab].analyticsDescription,
        badge: badgeCount > 0,
        contextScreenOwnerType: BottomTabOption[selectedTab],
      })
    )
  }

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={`${tab} bottom tab`}
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={{
        flex: 1,
        ...(enableNewNavigation && isStaging
          ? {
              borderTopWidth: 1,
              borderTopColor: isStaging ? color("devpurple") : color("black100"),
            }
          : {}),
      }}
      {...buttonProps}
    >
      <Flex flex={1} pt={enableNewNavigation ? 0.5 : 0}>
        <ProgressiveOnboardingFindSavedArtwork tab={tab}>
          <Flex flex={1} alignItems="center" overflow="hidden">
            <Flex flex={1} height={ICON_HEIGHT} width={ICON_WIDTH} justifyContent="center">
              <IconWrapper>
                <BottomTabsIcon tab={tab} state="inactive" />
              </IconWrapper>
              <IconWrapper>
                <View
                  style={{
                    opacity: isActive ? 1 : 0,
                    backgroundColor: "white",
                    width: ICON_WIDTH,
                    height: ICON_HEIGHT,
                  }}
                >
                  <BottomTabsIcon tab={tab} state="active" />
                </View>
              </IconWrapper>
            </Flex>

            <Flex
              mt={enableNewNavigation ? 0.5 : 0}
              height={BOTTOM_TABS_TEXT_HEIGHT}
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Text variant="xxs">{bottomTabsConfig[tab].name}</Text>
            </Flex>
          </Flex>
        </ProgressiveOnboardingFindSavedArtwork>

        {!!badgeCount && (
          <IconWrapper accessibilityLabel="badge count">
            <View style={{ width: ICON_WIDTH, height: ICON_HEIGHT }}>
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                }}
              >
                <PopIn yOffset={8} xOffset={-3}>
                  <Badge count={badgeCount} />
                </PopIn>
              </View>
            </View>
          </IconWrapper>
        )}
        {(!!showVisualClue(visualClue) || !!forceDisplayVisualClue) && (
          <IconWrapper accessibilityLabel={`${tab} visual clue`}>
            <View style={{ width: ICON_WIDTH, height: ICON_HEIGHT }}>
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 12,
                }}
              >
                <PopIn>
                  <VisualClueDot />
                </PopIn>
              </View>
            </View>
          </IconWrapper>
        )}
      </Flex>
    </Touchable>
  )
}

const Badge: React.FC<{ count: number }> = ({ count }) => {
  const color = useColor()
  const badgeSize = 18
  const borderWidth = 2
  return (
    // we need to hack together our own 2px white border here, otherwise the red background
    // bleeds into the antialiasing around the outer edge of the border :/
    <View
      style={{
        backgroundColor: "white",
        padding: borderWidth,
        borderRadius: (badgeSize + borderWidth * 2) / 2,
      }}
    >
      <View
        style={{
          flex: 1,
          height: badgeSize,
          minWidth: badgeSize,
          paddingHorizontal: 4,
          borderRadius: badgeSize / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: color("red100"),
        }}
      >
        <Text variant="xs" weight="medium" color="white" lineHeight="14px">
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    </View>
  )
}

const IconWrapper = styled(View)`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
`
