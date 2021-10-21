import { useActionSheet } from "@expo/react-native-action-sheet"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { TextArea } from "lib/Components/TextArea"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { Box, Button, Flex, Input, Join, Spacer, Text, Touchable, useColor } from "palette"
import React from "react"
import { ScrollView } from "react-native"

interface MyProfileEditFormModalProps {
  visible: boolean
  onDismiss(): void
}

export const MyProfileEditFormModal: React.FC<MyProfileEditFormModalProps> = (props) => {
  const { visible, onDismiss } = props
  const color = useColor()
  const { showActionSheetWithOptions } = useActionSheet()

  const chooseImageHandler = () => {
    showPhotoActionSheet(showActionSheetWithOptions).then((images) => {
      console.log("Images :: ", images)
    })
  }

  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => onDismiss()}>
        Edit Profile
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Join separator={<Spacer py={1} />}>
          <Flex flexDirection="row" alignItems="center" px={2} mt={2}>
            <Touchable onPress={chooseImageHandler}>
              <Box
                height="99"
                width="99"
                mr={2}
                borderRadius="50"
                backgroundColor={color("black10")}
                justifyContent="center"
                alignItems="center"
              >
                <Image source={require("../../../../images/profile_placeholder_avatar.webp")} />
              </Box>
            </Touchable>
            <Touchable haptic onPress={chooseImageHandler}>
              <Text style={{ textDecorationLine: "underline" }}>Choose an Image</Text>
            </Touchable>
          </Flex>
          <Flex mx={2}>
            <Input title="Name" required />
            <Spacer py={2} />
            <TextArea title="ABOUT" />
            <Spacer py={2} />
            <Button
              flex={1}
              onPress={() => {
                console.log("Save")
              }}
            >
              Save
            </Button>
          </Flex>
        </Join>
      </ScrollView>
    </FancyModal>
  )
}
