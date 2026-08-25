import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetBackdropProps, BottomSheetProps } from "@gorhom/bottom-sheet"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { CityGuideTabs, CityGuideTabsProps } from "app/Scenes/CityGuide/Components/CityGuideTabs"
import { DrawerPosition } from "app/Scenes/CityGuide/utils/types"
import { useEffect, useMemo, useRef } from "react"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"

interface CityGuideBottomSheetProps extends CityGuideTabsProps {
  drawerPosition: DrawerPosition
}

const BORDER_RADIUS = 20

const CityGuideBottomSheetBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const color = useColor()

  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 0.4], Extrapolate.CLAMP),
  }))

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: color("mono100"),
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  )

  return <Animated.View style={containerStyle} pointerEvents="none" />
}

export const CityGuideBottomSheet: React.FC<CityGuideBottomSheetProps> = ({ ...props }) => {
  const { height } = useScreenDimensions()
  const color = useColor()
  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    switch (props.drawerPosition) {
      case DrawerPosition.open:
        bottomSheetRef.current?.expand()
        break
      case DrawerPosition.closed:
        bottomSheetRef.current?.close()
        break
      case DrawerPosition.collapsed:
      case DrawerPosition.partiallyRevealed:
        bottomSheetRef.current?.collapse()
        break
    }
  }, [props.drawerPosition])

  const renderBackdrop: BottomSheetProps["backdropComponent"] = (props) => {
    return <CityGuideBottomSheetBackdrop {...props} />
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      snapPoints={[30, height * 0.75]}
      index={-1}
      handleIndicatorStyle={{
        ...defaultIndicatorHandleStyle(color),
        backgroundColor: color("mono30"),
      }}
      handleStyle={{
        backgroundColor: color("mono0"),
        height: BORDER_RADIUS,
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: BORDER_RADIUS,
        borderTopWidth: 1,
        borderTopColor: color("mono10"),
        shadowColor: color("mono100"),
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
      }}
      backdropComponent={renderBackdrop}
    >
      <CityGuideTabs {...props} />
    </BottomSheet>
  )
}
