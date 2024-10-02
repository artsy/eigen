import { Flex, FlexProps, useTheme } from "@artsy/palette-mobile"
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useRef } from "react"

export const AuthModal: React.FC<FlexProps> = ({ children, ...flexProps }) => {
  const { space } = useTheme()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  return (
    <Flex flex={1} {...flexProps}>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["35%", "100%"]}
          enableContentPanningGesture={false}
          handleComponent={null}
          enablePanDownToClose={false}
          detached
        >
          <Flex borderRadius={space(2)} overflow="hidden" flex={1} ml={-1} mr={-1} mb={-6}>
            {children}
          </Flex>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Flex>
  )
}
