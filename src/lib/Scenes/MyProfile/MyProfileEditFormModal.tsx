import { useActionSheet } from "@expo/react-native-action-sheet"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { Box, Flex, Join, Spacer, Touchable, useColor } from "palette"
import React from "react"
import { ScrollView, Text } from "react-native"

interface MyProfileEditFormModalProps {
  visible: boolean
  onDismiss(): void
}

export const MyProfileEditFormModal: React.FC<MyProfileEditFormModalProps> = (props) => {
  const { visible, onDismiss } = props
  const color = useColor()
  const { showActionSheetWithOptions } = useActionSheet()
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => onDismiss()}>
        Edit Profile
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Join separator={<Spacer py={1} />}>
          <Flex flexDirection="row" alignItems="center" px={2}>
            <Touchable
              onPress={() => {
                showPhotoActionSheet(showActionSheetWithOptions).then((images) => {
                  console.log("Images :: ", images)
                })
              }}
            >
              <Box
                height="100"
                width="100"
                borderRadius="50"
                backgroundColor={color("black10")}
                justifyContent="center"
                alignItems="center"
              >
                <Image source={require("../../../../images/profile_placeholder_avatar.webp")} />
              </Box>
            </Touchable>
            <Text>Choose an Image</Text>
          </Flex>
        </Join>
      </ScrollView>
    </FancyModal>
  )
}
