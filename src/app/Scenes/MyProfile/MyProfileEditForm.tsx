import { ActionType, ContextModule, EditedUserProfile, OwnerType } from "@artsy/cohesion"
import {
  Avatar,
  Box,
  Button,
  CheckCircleFillIcon,
  CheckCircleIcon,
  Flex,
  Join,
  Message,
  Spacer,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { useNavigation } from "@react-navigation/native"
import { MyProfileEditFormQuery } from "__generated__/MyProfileEditFormQuery.graphql"
import { MyProfileEditForm_me$key } from "__generated__/MyProfileEditForm_me.graphql"
import { Image } from "app/Components/Bidding/Elements/Image"
import { buildLocationDisplay } from "app/Components/LocationAutocomplete"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import {
  UserProfileFields,
  UserProfileFormikSchema,
  userProfileYupSchema,
} from "app/Scenes/MyProfile/Components/UserProfileFields"
import { fetchProfileData } from "app/Scenes/MyProfile/MyProfileHeader"
import { useEditProfile } from "app/Scenes/MyProfile/hooks/useEditProfile"
import { navigate } from "app/system/navigation/navigate"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { sendEmail } from "app/utils/sendEmail"
import { useHasBeenTrue } from "app/utils/useHasBeenTrue"
import { FormikProvider, useFormik } from "formik"
import React, { Fragment, Suspense, useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery, useRefetchableFragment } from "react-relay"
import { useTracking } from "react-tracking"
import * as Yup from "yup"
import { useHandleEmailVerification, useHandleIDVerification } from "./useHandleVerification"

const ICON_SIZE = 22

interface EditMyProfileValuesSchema extends UserProfileFormikSchema {
  photo: string
}

const editMyProfileSchema = userProfileYupSchema.shape({
  photo: Yup.string(),
})

interface MyProfileEditFormProps {
  onSuccess?: () => void
}

export const MyProfileEditForm: React.FC<MyProfileEditFormProps> = () => {
  const { trackEvent } = useTracking()
  const data = useLazyLoadQuery<MyProfileEditFormQuery>(MyProfileEditFormScreenQuery, {})
  const { updateProfile, isLoading, setIsLoading } = useEditProfile()

  const [me, refetch] = useRefetchableFragment<MyProfileEditFormQuery, MyProfileEditForm_me$key>(
    meFragment,
    data.me
  )

  const color = useColor()
  const navigation = useNavigation()

  const { showActionSheetWithOptions } = useActionSheet()

  const [refreshKey, setRefreshKey] = useState(0)
  const [localImagePath, setLocalImagePath] = useState<string>()

  const {
    showVerificationBanner: showVerificationBannerForEmail,
    handleVerification: handleEmailVerification,
  } = useHandleEmailVerification()

  const initiatorID = me?.internalID ?? ""
  const {
    showVerificationBanner: showVerificationBannerForID,
    handleVerification: handleIDVerification,
  } = useHandleIDVerification(initiatorID)

  const uploadProfilePhoto = async (photo: string) => {
    if (!localImagePath) {
      return
    }

    try {
      const iconUrl = await getConvertedImageUrlFromS3(photo)
      await updateProfile({ iconUrl }, localImagePath)
    } catch (error) {
      console.error("Failed to upload profile picture", error)
    }
  }

  const updateUserInfo = async ({
    name,
    location,
    profession,
    otherRelevantPositions,
  }: Partial<EditMyProfileValuesSchema>) => {
    const updatedLocation = { ...location }
    delete updatedLocation.display
    const payload = {
      name,
      location: updatedLocation,
      profession,
      otherRelevantPositions,
    }

    try {
      await updateProfile(payload)
    } catch (error) {
      console.error(`Failed to update ${Object.keys(payload).join(", ")}`, error)
    }
  }

  const formikBag = useFormik<EditMyProfileValuesSchema>({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: me?.name ?? "",
      displayLocation: { display: buildLocationDisplay(me?.location ?? null) },
      location: {
        ...me?.location,
      },
      profession: me?.profession ?? "",
      otherRelevantPositions: me?.otherRelevantPositions ?? "",
      photo: me?.icon?.url || "",
    },
    initialErrors: {},
    onSubmit: async ({ photo, ...otherValues }) => {
      try {
        setIsLoading(true)
        await Promise.all([updateUserInfo(otherValues), uploadProfilePhoto(photo)])

        trackEvent(tracks.editedUserProfile())
      } catch (error) {
        console.error("Failed to update profile", error)
      } finally {
        setIsLoading(false)
      }

      fetchProfileData()
      navigation.goBack()
    },
    validationSchema: editMyProfileSchema,
  })

  const { handleSubmit, handleChange, dirty, values } = formikBag

  // We want to keep the "Save" button enabled as soon as the user edits an input
  const touched = useHasBeenTrue(dirty)

  const chooseImageHandler = () => {
    showPhotoActionSheet(showActionSheetWithOptions, true, false)
      .then(async (images) => {
        if (images?.length >= 1) {
          setLocalImagePath(images[0].path)
          setRefreshKey(refreshKey + 1)
          handleChange("photo")(images[0].path)
        }
      })
      .catch((e) =>
        console.error("Error when uploading an image from the device", JSON.stringify(e))
      )
  }
  useEffect(() => {
    const refetchProfileIdentificationInterval = setInterval(() => {
      // When the user applies the email verification and the modal is visible
      if (showVerificationBannerForEmail || showVerificationBannerForID) {
        refetch({})
      }
    }, 3000)

    return () => {
      clearInterval(refetchProfileIdentificationInterval)
    }
  }, [showVerificationBannerForEmail, showVerificationBannerForID])

  const showCompleteYourProfileBanner = !me?.collectorProfile?.isProfileComplete

  return (
    <>
      {!!showCompleteYourProfileBanner && (
        <Message
          variant="info"
          title="Complete your profile and make a great impression"
          text="The information you provide here will be shared when you contact a gallery or make an offer."
          showCloseButton
        />
      )}

      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Join separator={<Spacer y={1} />}>
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
                {!!localImagePath || values.photo ? (
                  <Avatar src={localImagePath || values.photo} size="md" />
                ) : (
                  <Image source={require("images/profile_placeholder_avatar.webp")} />
                )}
              </Box>
            </Touchable>
            <Touchable haptic onPress={chooseImageHandler}>
              <Text style={{ textDecorationLine: "underline" }}>Choose an Image</Text>
            </Touchable>
          </Flex>
          <Flex m={2} gap={2}>
            <FormikProvider value={formikBag}>
              <UserProfileFields />
            </FormikProvider>

            <ProfileVerifications
              isIDVerified={!!me?.isIdentityVerified}
              canRequestEmailConfirmation={!!me?.canRequestEmailConfirmation}
              isEmailConfirmed={!!me?.isEmailConfirmed}
              handleEmailVerification={handleEmailVerification}
              handleIDVerification={handleIDVerification}
            />

            <Button flex={1} disabled={!touched} onPress={handleSubmit} mb={2}>
              Save
            </Button>
          </Flex>
        </Join>
      </ScrollView>
      {!!showVerificationBannerForEmail && (
        <VerificationBanner resultText={`Email sent to ${me?.email ?? ""}`} />
      )}
      {!!showVerificationBannerForID && (
        <VerificationBanner resultText={`ID verification link sent to ${me?.email ?? ""}.`} />
      )}
      <LoadingModal isVisible={isLoading} />
    </>
  )
}

const meFragment = graphql`
  fragment MyProfileEditForm_me on Me @refetchable(queryName: "MyProfileEditForm_meRefetch") {
    name
    profession
    otherRelevantPositions
    internalID
    location {
      display
      city
      state
      country
    }
    icon {
      url(version: "thumbnail")
    }
    email
    isEmailConfirmed
    isIdentityVerified
    canRequestEmailConfirmation
    collectorProfile {
      isProfileComplete
    }
  }
`

const MyProfileEditFormScreenQuery = graphql`
  query MyProfileEditFormQuery {
    me {
      ...MyProfileEditForm_me
    }
  }
`

export const MyProfileEditFormScreen: React.FC<MyProfileEditFormProps> = (props) => {
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")
  const Wrapper = enableNewNavigation
    ? Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <PageWithSimpleHeader title="Edit Profile">{children}</PageWithSimpleHeader>
      )

  return (
    <Wrapper>
      <ArtsyKeyboardAvoidingView>
        <Suspense fallback={<LoadingSkeleton />}>
          <MyProfileEditForm {...props} />
        </Suspense>
      </ArtsyKeyboardAvoidingView>
    </Wrapper>
  )
}

const LoadingSkeleton = () => {
  return (
    <ProvidePlaceholderContext>
      <Flex flexDirection="row" pl={2} alignItems="center" mt={2}>
        <PlaceholderBox width={99} height={99} borderRadius={50} />
        <PlaceholderText width={100} height={20} marginTop={6} marginLeft={20} />
      </Flex>
      {[...Array(4)].map((_x, i) => (
        <Flex mt={4} key={i}>
          <Flex mx={2}>
            <PlaceholderText width={100} height={20} marginTop={6} />
            <PlaceholderBox height={50} marginTop={6} />
          </Flex>
        </Flex>
      ))}
      <Flex mt={4}>
        <Flex mx={2}>
          <PlaceholderText width={100} height={20} marginTop={6} />
          <PlaceholderBox height={100} marginTop={6} />
        </Flex>
      </Flex>
      <Spacer y={2} />
      <PlaceholderBox height={50} marginTop={6} borderRadius={50} marginHorizontal={20} />
    </ProvidePlaceholderContext>
  )
}

const VerifiedRow: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const color = useColor()

  return (
    <Flex flexDirection="row">
      <Flex mt="3px">
        <CheckCircleFillIcon height={ICON_SIZE} width={ICON_SIZE} fill="green100" />
      </Flex>
      <Flex ml={1}>
        <Text>{title}</Text>
        <Text color={color("black60")}>{subtitle}</Text>
      </Flex>
    </Flex>
  )
}

const ProfileVerifications = ({
  canRequestEmailConfirmation,
  isEmailConfirmed,
  handleEmailVerification,
  handleIDVerification,
  isIDVerified,
}: {
  canRequestEmailConfirmation: boolean
  isEmailConfirmed: boolean
  handleEmailVerification: () => void
  handleIDVerification: () => void
  isIDVerified: boolean
}) => {
  const color = useColor()

  return (
    <Flex testID="profile-verifications" pr={2}>
      {/* ID Verification */}
      {isIDVerified ? (
        <VerifiedRow
          title="ID Verified"
          subtitle="For details, see FAQs or contact verification@artsy.net"
        />
      ) : (
        <Flex flexDirection="row">
          <Flex mt="3px">
            <CheckCircleIcon height={ICON_SIZE} width={ICON_SIZE} fill="black30" />
          </Flex>
          <Flex ml={1}>
            <Text onPress={handleIDVerification} style={{ textDecorationLine: "underline" }}>
              Verify Your ID
            </Text>
            <Text color={color("black60")}>
              For details, see{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => navigate(`https://www.artsy.net/identity-verification-faq`)}
              >
                FAQs
              </Text>{" "}
              or contact{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => sendEmail("verification@artsy.net", { subject: "ID Verification" })}
              >
                verification@artsy.net
              </Text>
              .
            </Text>
          </Flex>
        </Flex>
      )}

      <Spacer y={4} />

      {/* Email Verification */}
      {isEmailConfirmed ? (
        <VerifiedRow
          title="Email Address Verified"
          subtitle="Secure your account and receive updates about your transactions on Artsy."
        />
      ) : (
        <Flex flexDirection="row">
          <Flex mt="3px">
            <CheckCircleIcon height={ICON_SIZE} width={ICON_SIZE} fill="black30" />
          </Flex>
          <Flex ml={1}>
            {canRequestEmailConfirmation ? (
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={handleEmailVerification}
                testID="verify-your-email"
              >
                Verify Your Email
              </Text>
            ) : (
              <Text
                style={{ textDecorationLine: "none" }}
                color="black60"
                testID="verify-your-email"
              >
                Verify Your Email
              </Text>
            )}

            <Text color="black60">
              Secure your account and receive updates about your transactions on Artsy.
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

const VerificationBanner = ({ resultText }: { resultText: string }) => {
  const color = useColor()

  return (
    <Flex
      px={2}
      py={1}
      // Avoid system bottom navigation bar
      backgroundColor="black100"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      testID="verification-confirmation-banner"
    >
      <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
        <Text color={color("white100")} numberOfLines={2}>
          {resultText}
        </Text>
      </Flex>
    </Flex>
  )
}

const tracks = {
  editedUserProfile: (): EditedUserProfile => ({
    action: ActionType.editedUserProfile,
    context_screen: ContextModule.collectorProfile,
    context_screen_owner_type: OwnerType.editProfile,
    platform: "mobile",
  }),
}
