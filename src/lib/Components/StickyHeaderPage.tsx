import { useAnimatedValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import { useAutoCollapsingMeasuredView } from "lib/Components/StickyTabPage/StickyTabPage"
import { useUpdadeShouldHideBackButton } from "lib/utils/hideBackButtonOnScroll"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useState } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"

interface StickyHeaderPageProps {
  headerContent: JSX.Element
  stickyHeaderContent: JSX.Element
  footerContent?: JSX.Element
}

export const StickyHeaderPage: React.FC<StickyHeaderPageProps> = (props) => {
  const { headerContent, stickyHeaderContent, footerContent, children } = props

  const [footerOffsetY, setFooterOffsetY] = useState<Animated.Value<number>>(new Animated.Value(-1))
  const { jsx: staticHeader, nativeHeight: headerHeight } = useAutoCollapsingMeasuredView(headerContent)
  const { jsx: stickyHeader, nativeHeight: stickyHeaderHeight } = useAutoCollapsingMeasuredView(stickyHeaderContent)
  const scrollOffsetY = useAnimatedValue(0)
  const { width: screenWidth } = useScreenDimensions()
  const updateShouldHideBackButton = useUpdadeShouldHideBackButton()

  const shouldHideBackButton = Animated.greaterOrEq(scrollOffsetY, 10)
  const stickyHeaderOffsetY = Animated.max(Animated.sub(headerHeight ?? 0, scrollOffsetY), 0)
  const scrollStickyHeaderOffsetY = Animated.add(scrollOffsetY, stickyHeaderHeight ?? 0)
  const translateY = Animated.cond(
    Animated.greaterThan(footerOffsetY, 0),
    Animated.cond(
      Animated.greaterThan(scrollStickyHeaderOffsetY, footerOffsetY),
      Animated.max(
        Animated.sub(footerOffsetY, scrollStickyHeaderOffsetY),
        Animated.multiply(-1, stickyHeaderHeight ?? 0)
      ),
      stickyHeaderOffsetY
    ),
    stickyHeaderOffsetY
  )

  Animated.useCode(
    () =>
      Animated.onChange(
        shouldHideBackButton,
        Animated.call([shouldHideBackButton], ([shouldHide]) => {
          updateShouldHideBackButton(!!shouldHide)
        })
      ),
    []
  )

  return (
    <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <Animated.ScrollView
        scrollEventThrottle={0.0000000001}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollOffsetY },
              },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
      >
        {staticHeader}
        <Animated.View style={{ width: screenWidth, height: stickyHeaderHeight ?? 0 }} />
        {children}
        {!!footerContent && (
          <View onLayout={(event) => setFooterOffsetY(new Animated.Value(event.nativeEvent.layout.y))}>
            {footerContent}
          </View>
        )}
      </Animated.ScrollView>
      <Animated.View
        style={{
          position: "absolute",
          transform: [{ translateY }],
          width: screenWidth,
        }}
      >
        {stickyHeader}
      </Animated.View>
    </View>
  )
}
