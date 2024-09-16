import { Flex, useTheme } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AuthenticationWizard } from "app/Scenes/Onboarding/Components/AuthenticationWizard"
import React, { useRef } from "react"
import { View } from "react-native"

export const AuthenticationDialog: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { space } = useTheme()

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["100%"]}
        detached
        enableContentPanningGesture={false}
        handleComponent={null}
      >
        <BottomSheetScrollView>
          <Flex padding={2} gap={space(1)}>
            <AuthenticationWizard />
          </Flex>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}
