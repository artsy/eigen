import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { CityView, CityViewProps } from "app/Scenes/City/City"
import { CityBottomSheetBackdrop } from "app/Scenes/City/Components/CityBottomSheetBackdrop"
import { DrawerPosition } from "app/utils/cityGuide/types"
import { useEffect, useRef } from "react"
import { SharedValue } from "react-native-reanimated"

interface CityBottomSheetProps extends CityViewProps {
  drawerPosition: DrawerPosition
  updateDrawerPosition: (position: DrawerPosition) => void
  bottomSheetAnimatedIndex: SharedValue<number>
}

const BORDER_RADIUS = 20

export const CityBottomSheet: React.FC<CityBottomSheetProps> = ({ ...props }) => {
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
    return <CityBottomSheetBackdrop {...props} />
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      snapPoints={[30, height * 0.75]}
      index={-1}
      animatedIndex={props.bottomSheetAnimatedIndex}
      onChange={(index) => {
        if (index === 1) {
          props.updateDrawerPosition(DrawerPosition.open)
          return
        } else if (index === 0) {
          props.updateDrawerPosition(DrawerPosition.collapsed)
          return
        }
      }}
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
      <CityView {...props} />
    </BottomSheet>
  )
}
