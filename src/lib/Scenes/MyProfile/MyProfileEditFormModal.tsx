import { useActionSheet } from "@expo/react-native-action-sheet"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { TextArea } from "lib/Components/TextArea"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { isArray } from "lodash"
import { Avatar, Box, Button, Flex, Input, Join, Spacer, Text, Touchable, useColor } from "palette"
import React, { useRef } from "react"
import { ScrollView, TextInput } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import * as Yup from "yup"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "../Consignments/Submission/geminiUploadToS3"
import { myProfileUpdateProfile } from "./myProfileUpdateProfile"

interface MyProfileEditFormModalProps {
  visible: boolean
  onDismiss(): void
}

export interface EditMyProfileValuesSchema {
  photo: string
  name: string
  bio: string
}

export const editMyProfileSchema = Yup.object().shape({
  photo: Yup.string(),
  name: Yup.string().required("Name is required").min(1, "Name is required"),
  bio: Yup.string(),
})

export async function uploadPhoto(photo: EditMyProfileValuesSchema["photo"]) {
  const convectionKey = await getConvectionGeminiKey()
  const acl = "private"
  const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })
  const bucket = assetCredentials.policyDocument.conditions.bucket
  const s3 = await uploadFileToS3(photo, acl, assetCredentials)
  return `https://${bucket}.s3.amazonaws.com/${s3.key}`
}

export const MyProfileEditFormModal: React.FC<MyProfileEditFormModalProps> = (props) => {
  const { visible, onDismiss } = props
  const color = useColor()
  const { showActionSheetWithOptions } = useActionSheet()
  const nameInputRef = useRef<Input>(null)
  const bioInputRef = useRef<TextInput>(null)

  const { handleSubmit, handleChange, dirty, values, errors, validateForm } = useFormik<EditMyProfileValuesSchema>({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: me?.name ?? "",
      bio: "",
      photo: "",
    },
    initialErrors: {},
    onSubmit: async ({ name, bio, photo }) => {
      console.log("Submitting....", name, bio, photo)
      try {
        const externalPhotoUrl = await uploadPhoto(photo)
        console.log("Check :: ", externalPhotoUrl)
        await myProfileUpdateProfile({ name, bio, photo })
      } catch (e) {
        console.log("Catch error ", e)
      }
      onDismiss()
    },
    validationSchema: editMyProfileSchema,
  })

  const chooseImageHandler = () => {
    showPhotoActionSheet(showActionSheetWithOptions, false).then((images) => {
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
            <TextArea ref={bioInputRef} title="ABOUT" onChangeText={handleChange("bio") as (value: string) => void} />
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

export const MyProfileEditFormModalFragmentContainer = createFragmentContainer(MyProfileEditFormModal, {
  me: graphql`
    fragment MyProfileEditFormModal_me on Me {
      name
      bio
    }
  `,
})
