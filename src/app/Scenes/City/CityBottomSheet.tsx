import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { CityView, CityViewProps } from "app/Scenes/City/City"
import { CityBottomSheetBackdrop } from "app/Scenes/City/Components/CityBottomSheetBackdrop"
import { DrawerPosition } from "app/Scenes/Map/GlobalMap"
import { useEffect, useRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface CityBottomSheetProps extends CityViewProps {
  drawerPosition: DrawerPosition
}

const BORDER_RADIUS = 10

export const CityBottomSheet: React.FC<CityBottomSheetProps> = ({ ...props }) => {
  const { bottom } = useSafeAreaInsets()
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
      snapPoints={[bottom + 95, height * 0.88]}
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
      }}
      backdropComponent={renderBackdrop}
    >
      <CityView {...props} />
    </BottomSheet>
  )
}
