import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { EditableLocation } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { MyProfileEditForm_me$key } from "__generated__/MyProfileEditForm_me.graphql"
import { useFormik } from "formik"
import { Image } from "lib/Components/Bidding/Elements/Image"
import {
  buildLocationDisplay,
  DetailedLocationAutocomplete,
} from "lib/Components/DetailedLocationAutocomplete"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { getConvertedImageUrlFromS3 } from "lib/utils/getConvertedImageUrlFromS3"
import { LocalImage } from "lib/utils/LocalImageStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { compact, isArray } from "lodash"
import { Avatar, Box, Button, Flex, Input, Join, Spacer, Text, Touchable, useColor } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView, TextInput } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import * as Yup from "yup"
import { updateMyUserProfile } from "../MyAccount/updateMyUserProfile"
import { MyProfileStackTypes } from "./MyProfile"

const PRIMARY_LOCATION_OFFSET = 240

// interface MyProfileEditFormProps {
//   visible: boolean
//   me: MyProfileEditForm_me$key
//   setProfileIconLocally: (path: string) => void
//   localImage: LocalImage | null
//   onDismiss(): void
// }

export interface EditMyProfileValuesSchema {
  photo: string
  name: string
  displayLocation: { display: string | null }
  location: EditableLocation | null
  profession: string
  otherRelevantPositions: string
  bio: string
}

export const editMyProfileSchema = Yup.object().shape({
  photo: Yup.string(),
  name: Yup.string().required("Name is required"),
  bio: Yup.string(),
})

export const MyProfileEditForm: React.FC<
  StackScreenProps<MyProfileStackTypes, "MyProfileEditForm">
> = ({ route }) => {
  console.log("CHECK :: ", route)
  const me = useFragment<MyProfileEditForm_me$key>(meFragment, route?.params.me)

  const color = useColor()

  const scrollViewRef = useRef<ScrollView>(null)
  const { showActionSheetWithOptions } = useActionSheet()

  const nameInputRef = useRef<Input>(null)
  const bioInputRef = useRef<TextInput>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [didUpdatePhoto, setDidUpdatePhoto] = useState(false)

  const enableCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  const uploadProfilePhoto = async (photo: string) => {
    const existingProfileImage = me.icon?.url ?? ""
    try {
      // We want to show the local image initially for better UX since Gemini takes a while to process
      route.params.setProfileIconLocally(photo)
      const iconUrl = await getConvertedImageUrlFromS3(photo)
      await updateMyUserProfile({ iconUrl })
    } catch (error) {
      route.params.setProfileIconLocally(existingProfileImage)
      console.error("Failed to upload profile picture ", error)
    }
  }

  const updateUserInfo = async ({
    name,
    location,
    profession,
    otherRelevantPositions,
    bio,
  }: Partial<EditMyProfileValuesSchema>) => {
    const payload = {
      name,
      ...(location ? { location } : {}),
      profession,
      otherRelevantPositions,
      bio,
    }

    try {
      await updateMyUserProfile(payload)
    } catch (error) {
      console.error(`Failed to update ${Object.keys(payload).join(", ")}`, error)
    }
  }

  const { handleSubmit, handleChange, setFieldValue, dirty, values, errors, validateForm } =
    useFormik<EditMyProfileValuesSchema>({
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: true,
      initialValues: {
        name: me?.name ?? "",
        displayLocation: { display: buildLocationDisplay(me.location) },
        location: null,
        profession: me?.profession ?? "",
        otherRelevantPositions: me?.otherRelevantPositions ?? "",
        bio: me?.bio ?? "",
        photo: me?.icon?.url ?? route.params.localImage?.path ?? "",
      },
      initialErrors: {},
      onSubmit: async ({ photo, ...otherValues }) => {
        try {
          setLoading(true)
          await Promise.all(
            compact([
              await updateUserInfo(otherValues),
              didUpdatePhoto && (await uploadProfilePhoto(photo)),
            ])
          )
        } catch (error) {
          console.error("Failed to update user profile ", error)
        } finally {
          setLoading(false)
        }
      },
      validationSchema: editMyProfileSchema,
    })

  const chooseImageHandler = () => {
    showPhotoActionSheet(showActionSheetWithOptions, true, false)
      .then((images) => {
        if (isArray(images) && images.length >= 1) {
          setDidUpdatePhoto(true)
          ;(handleChange("photo") as (value: string) => void)(images[0].path)
        }
      })
      .catch((e) =>
        console.error("Error when uploading an image from the device", JSON.stringify(e))
      )
  }

  // const hideModal = () => {
  //   setDidUpdatePhoto(false)

  //   handleChange("photo")(me?.icon?.url ?? route.params.localImage?.path ?? "")
  //   handleChange("name")(me?.name ?? "")
  //   handleChange("bio")(me?.bio ?? "")
  // }

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={route.params.onHeaderBackButtonPress}
        rightButtonText="Skip"
        hideBottomDivider
      >
        Select an Artwork
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
          <Flex m={2}>
            <Join separator={<Spacer py={2} />}>
              <Input
                ref={nameInputRef}
                title="Full Name"
                onChangeText={handleChange("name")}
                onBlur={() => validateForm()}
                error={errors.name}
                returnKeyType="next"
                defaultValue={values.name}
              />

              {!!enableCollectorProfile && (
                <DetailedLocationAutocomplete
                  title="Primary Location"
                  placeholder="City Name"
                  returnKeyType="next"
                  initialLocation={values.displayLocation?.display!}
                  onFocus={() =>
                    requestAnimationFrame(() =>
                      scrollViewRef.current?.scrollTo({ y: PRIMARY_LOCATION_OFFSET })
                    )
                  }
                  onChange={({ city, country, postalCode, state, stateCode }) => {
                    setFieldValue("location", {
                      city: city ?? "",
                      country: country ?? "",
                      postalCode: postalCode ?? "",
                      state: state ?? "",
                      stateCode: stateCode ?? "",
                    })
                  }}
                />
              )}

              {!!enableCollectorProfile && (
                <Input
                  ref={nameInputRef}
                  title="Profession"
                  onChangeText={handleChange("profession")}
                  onBlur={() => validateForm()}
                  error={errors.name}
                  returnKeyType="next"
                  defaultValue={values.profession}
                  placeholder="Select Your Profession"
                />
              )}

              {!!enableCollectorProfile && (
                <Input
                  ref={nameInputRef}
                  title="Other Relevant Positions"
                  onChangeText={handleChange("otherRelevantPositions")}
                  onBlur={() => validateForm()}
                  error={errors.name}
                  returnKeyType="next"
                  defaultValue={values.otherRelevantPositions}
                  placeholder="Institution Name and Position"
                />
              )}

              <Input
                ref={bioInputRef}
                title="About"
                onChangeText={handleChange("bio")}
                onBlur={() => validateForm()}
                error={errors.bio}
                maxLength={150}
                multiline
                showLimit
                defaultValue={values.bio}
                placeholder="You can add a short bio to tell more about yourself and your collection. It can be anything like the artists you collect, the genres you're interested in , etc."
              />

              <Button flex={1} disabled={!dirty} onPress={handleSubmit} mb={2}>
                Save
              </Button>
            </Join>
          </Flex>
        </Join>
      </ScrollView>
      <LoadingModal isVisible={loading} />
    </>
  )
}

const meFragment = graphql`
  fragment MyProfileEditForm_me on Me {
    name
    profession
    otherRelevantPositions
    bio
    location {
      display
      city
      state
      country
    }
    icon {
      url(version: "thumbnail")
    }
  }
`
