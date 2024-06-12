import { tappedTabBar } from "@artsy/cohesion"
import { Flex, PopIn, Text, VisualClueDot, useColor } from "@artsy/palette-mobile"
import { ProgressiveOnboardingFindSavedArtwork } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingFindSavedArtwork"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { unsafe__getSelectedTab } from "app/store/GlobalStore"
import { VisualClueName } from "app/store/config/visualClues"
import { switchTab } from "app/system/navigation/navigate"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { useVisualClue } from "app/utils/hooks/useVisualClue"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, TouchableWithoutFeedback, View } from "react-native"
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
}

export const BOTTOM_TABS_TEXT_HEIGHT = 15

export const BottomTabsButton: React.FC<BottomTabsButtonProps> = ({
  tab,
  badgeCount = 0,
  visualClue,
  forceDisplayVisualClue,
}) => {
  const selectedTab = useSelectedTab()
  const isActive = selectedTab === tab
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const [isBeingPressed, setIsBeingPressed] = useState(false)
  const showActiveState = isActive || isBeingPressed

  const activeProgress = useRef(new Animated.Value(showActiveState ? 1 : 0)).current

  const { showVisualClue } = useVisualClue()

  useEffect(() => {
    Animated.timing(activeProgress, {
      toValue: showActiveState ? 1 : 0,
      useNativeDriver: true,
      easing: Easing.ease,
      duration: 100,
    }).start()
  }, [showActiveState])

  const tracking = useTracking()

  const onPress = () => {
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
    <TouchableWithoutFeedback
      accessibilityRole="button"
      accessibilityLabel={`${tab} bottom tab`}
      accessibilityState={{ selected: isActive }}
      onPressIn={() => {
        clearTimeout(timeout.current)
        setIsBeingPressed(true)
      }}
      onPressOut={() => {
        timeout.current = setTimeout(() => {
          setIsBeingPressed(false)
        }, 150)
      }}
      onPress={onPress}
      onLongPress={onPress}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ProgressiveOnboardingFindSavedArtwork tab={tab}>
          <Flex flex={1} alignItems="center">
            <Flex flex={1} height={ICON_HEIGHT}>
              <IconWrapper>
                <BottomTabsIcon tab={tab} state="inactive" />
              </IconWrapper>
              <IconWrapper>
                <Animated.View
                  style={{
                    opacity: activeProgress,
                    backgroundColor: "white",
                    width: ICON_WIDTH,
                    height: ICON_HEIGHT,
                  }}
                >
                  <BottomTabsIcon tab={tab} state="active" />
                </Animated.View>
              </IconWrapper>
            </Flex>

            <Flex
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
      </View>
    </TouchableWithoutFeedback>
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
