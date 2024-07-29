import { ActionType, ContextModule, EditedUserProfile, OwnerType } from "@artsy/cohesion"
import { Box, Button, Text } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { buildLocationDisplay } from "app/Components/LocationAutocomplete"
import {
  UserProfileFields,
  UserProfileFormikSchema,
  userProfileYupSchema,
} from "app/Scenes/MyProfile/Components/UserProfileFields"
import { useUpdateUserProfileFields } from "app/Scenes/MyProfile/useUpdateUserProfileFields"
import { FormikProvider, useFormik } from "formik"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MyProfileEditModalProps {
  me: MyProfileEditModal_me$key
  message: string
  onClose: () => void
  visible: boolean
}

export const MyProfileEditModal: React.FC<MyProfileEditModalProps> = ({
  me,
  message,
  onClose,
  visible,
}) => {
  /**
   * TODO: On Android
   *
   * 1. The modal glitches during autocompletion
   * 2. The submit button doesn't work after selecting a location
   *   - This also happens on the settings screen (on the main branch)
   * 3. The primary location field title is behind the outline
   *   - This does not happen in the settings screen (on the feature branch)
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
      location:
        {
          ...data.location,
        } ?? undefined,
      profession: data.profession ?? "",
      otherRelevantPositions: data.otherRelevantPositions ?? "",
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
          setLoading(false)
          onClose()
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
        onClose()
      },
      onError: (error) => {
        console.error("[MyProfileEditModal] Error updating last prompt timestamp", error)
      },
    })
  }

  return (
    <AutomountedBottomSheetModal
      visible={visible}
      onDismiss={handleDismiss}
      enableDynamicSizing
      style={{
        // this allows us to test assertions about the visibility of this modal
        display: visible ? "flex" : "none",
      }}
    >
      <BottomSheetScrollView keyboardShouldPersistTaps="always">
        <Box p={2}>
          <Text>{message}</Text>
          <FormikProvider value={formikBag}>
            <UserProfileFields bottomSheetInput />
            <Button
              block
              mt={2}
              mb={4}
              onPress={handleSubmit}
              disabled={!isValid}
              loading={loading}
            >
              Save and Continue
            </Button>
          </FormikProvider>
        </Box>
      </BottomSheetScrollView>
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
