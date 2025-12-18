import { ActionType, ContextModule, EditedUserProfile, OwnerType } from "@artsy/cohesion"
import { Box, Button, Text } from "@artsy/palette-mobile"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { buildLocationDisplay } from "app/Components/LocationAutocomplete"
import {
  UserProfileFields,
  UserProfileFormikSchema,
  userProfileYupSchema,
} from "app/Scenes/MyProfile/Components/UserProfileFields"
import { fetchProfileData } from "app/Scenes/MyProfile/fetchProfileData"
import { useUpdateUserProfileFields } from "app/Scenes/MyProfile/useUpdateUserProfileFields"
import BottomSheetKeyboardAwareScrollView from "app/utils/keyboard/BottomSheetKeyboardAwareScrollView"
import { FormikProvider, useFormik } from "formik"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MyProfileEditModalProps {
  me: MyProfileEditModal_me$key
  message: string
  onDismiss: () => void
  visible: boolean
}

export const MyProfileEditModal: React.FC<MyProfileEditModalProps> = ({
  me,
  message,
  onDismiss,
  visible,
}) => {
  /**
   * TODO: I have observed the following issues with this modal in the Android emulator:
   *
   * 1. The modal flickers during autocompletion
   * 2. The submit button doesn't respond after selecting a new location
   * 3. The title of the location field is rendered behind its outline
   * 4. The modal overlay doesn't disappear after closing the modal
   */

  const data = useFragment(meFragmentQuery, me)

  const [loading, setLoading] = useState<boolean>(false)

  const { trackEvent } = useTracking()

  const [commit] = useUpdateUserProfileFields()

  const formikBag = useFormik<UserProfileFormikSchema>({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: data.name ?? "",
      displayLocation: { display: buildLocationDisplay(data.location ?? null) },
      location: {
        ...data.location,
      },
      profession: data.profession ?? "",
      otherRelevantPositions: data.otherRelevantPositions ?? "",
      instagram: data?.collectorProfile?.instagram ?? "",
      linkedIn: data?.collectorProfile?.linkedIn ?? "",
    },
    onSubmit: (values) => {
      setLoading(true)

      commit({
        variables: {
          input: {
            name: values.name,
            location: {
              city: values.location?.city,
              state: values.location?.state,
              country: values.location?.country,
            },
            profession: values.profession,
            otherRelevantPositions: values.otherRelevantPositions,
            promptedForUpdate: true,
          },
        },
        onCompleted: () => {
          trackEvent(tracks.editedUserProfile())
          fetchProfileData()
          setLoading(false)
          onDismiss()
        },
        onError: (error) => {
          console.error("[MyProfileEditModal] Error updating user profile", error)
          setLoading(false)
        },
      })
    },
    validationSchema: userProfileYupSchema,
  })

  const { handleSubmit, isValid } = formikBag

  const handleDismiss = () => {
    commit({
      variables: {
        input: {
          promptedForUpdate: true,
        },
      },
      onCompleted: () => {
        onDismiss()
      },
      onError: (error) => {
        console.error("[MyProfileEditModal] Error updating last prompt timestamp", error)
      },
    })
  }

  return (
    <AutomountedBottomSheetModal visible={visible} onDismiss={handleDismiss} enableDynamicSizing>
      <BottomSheetKeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <Box p={2}>
          <Text>{message}</Text>
          <FormikProvider value={formikBag}>
            <UserProfileFields bottomSheetInput />
            <Button
              block
              mt={2}
              mb={4}
              onPress={() => handleSubmit()}
              disabled={!isValid}
              loading={loading}
            >
              Save and Continue
            </Button>
          </FormikProvider>
        </Box>
      </BottomSheetKeyboardAwareScrollView>
    </AutomountedBottomSheetModal>
  )
}

const meFragmentQuery = graphql`
  fragment MyProfileEditModal_me on Me {
    name
    location {
      city
      state
      country
    }
    profession
    otherRelevantPositions
    collectorProfile {
      instagram
      linkedIn
    }
  }
`

// TODO: update cohesion and pass a better context_screen and context_screen_owner_type
const tracks = {
  editedUserProfile: (): EditedUserProfile => ({
    action: ActionType.editedUserProfile,
    context_screen: ContextModule.collectorProfile,
    context_screen_owner_type: OwnerType.editProfile,
    platform: "mobile",
  }),
}
