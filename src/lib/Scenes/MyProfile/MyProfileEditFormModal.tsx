import { useActionSheet } from "@expo/react-native-action-sheet"
import { MyProfileEditFormModal_me } from "__generated__/MyProfileEditFormModal_me.graphql"
import { useFormik } from "formik"
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
import { updateMyUserProfile } from "../MyAccount/updateMyUserProfile"

interface MyProfileEditFormModalProps {
  visible: boolean
  me: MyProfileEditFormModal_me
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
  const { visible, onDismiss, me } = props
  const color = useColor()
  const { showActionSheetWithOptions } = useActionSheet()
  const nameInputRef = useRef<Input>(null)
  const aboutInputRef = useRef<TextInput>(null)

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
      try {
        const iconUrl = await uploadPhoto(photo)
        await updateMyUserProfile({ name, bio, iconUrl })
      } catch (e) {
        console.log("Catch error ", e)
      }
      onDismiss()
    },
    validationSchema: editMyProfileSchema,
  })

  const chooseImageHandler = () => {
    showPhotoActionSheet(showActionSheetWithOptions, false)
      .then((images) => {
        if (isArray(images) && images.length >= 1) {
          ;(handleChange("photo") as (value: string) => void)(images[0].path)
        }
      })
      .catch((e) => console.error("Error when uploading an image from the device", JSON.stringify(e)))
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
                {!!values.photo ? (
                  <Avatar src={values.photo} size="md" />
                ) : (
                  <Image source={require("../../../../images/profile_placeholder_avatar.webp")} />
                )}
              </Box>
            </Touchable>
            <Touchable haptic onPress={chooseImageHandler}>
              <Text style={{ textDecorationLine: "underline" }}>Choose an Image</Text>
            </Touchable>
          </Flex>
          <Flex mx={2}>
            <Input
              ref={nameInputRef}
              title="Name"
              required
              onChangeText={handleChange("name") as (value: string) => void}
              onBlur={() => validateForm()}
              error={errors.name}
              returnKeyType="next"
              defaultValue={values.name}
            />
            <Spacer py={2} />
            <TextArea
              ref={aboutInputRef}
              title="ABOUT"
              onChangeText={handleChange("about") as (value: string) => void}
            />
            <Spacer py={2} />
            <Button flex={1} disabled={!dirty} onPress={handleSubmit}>
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
      icon {
        internalID
        imageURL
      }
    }
  `,
})
