import { Flex, FlexProps, useTheme } from "@artsy/palette-mobile"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useEffect, useRef } from "react"

export const AuthModal: React.FC<FlexProps> = ({ children }) => {
  const { space } = useTheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={["35%", "80%"]}
      enableContentPanningGesture={false}
      handleComponent={null}
      enablePanDownToClose={false}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      // detached
    >
      <Flex borderRadius={space(2)} flex={1} ml={2} mr={2}>
        {children}
      </Flex>
    </BottomSheetModal>
  )
}
