import { useScreenDimensions } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { CityView, CityViewProps } from "app/Scenes/City/City"
import { CityBottomSheetBackdrop } from "app/Scenes/City/Components/CityBottomSheetBackdrop"
import { DrawerPosition } from "app/Scenes/Map/GlobalMap"
import { useEffect, useRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface CityBottomSheetProps extends CityViewProps {
  drawerPosition: DrawerPosition
}

export const CityBottomSheet: React.FC<CityBottomSheetProps> = ({ ...props }) => {
  const { bottom } = useSafeAreaInsets()
  const { height } = useScreenDimensions()
  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    switch (props.drawerPosition) {
      case DrawerPosition.open:
        bottomSheetRef.current?.expand()
        break
      case DrawerPosition.closed:
        console.log("DEBUG: closing bottom sheet")
        bottomSheetRef.current?.close()
        break
      case DrawerPosition.collapsed:
        console.log("DEBUG: closing bottom sheet")
        bottomSheetRef.current?.collapse()
        break
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
      snapPoints={[bottom + 90, height * 0.88]}
      index={-1}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
    >
      <CityView {...props} />
    </BottomSheet>
  )
}
