import { ActionType, ContextModule, EditedUserProfile, OwnerType } from "@artsy/cohesion"
import {
  Box,
  Button,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { MyProfileEditModalQuery } from "__generated__/MyProfileEditModalQuery.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { buildLocationDisplay } from "app/Components/LocationAutocomplete"
import {
  UserProfileFields,
  UserProfileFormikSchema,
  userProfileYupSchema,
} from "app/Scenes/MyProfile/Components/UserProfileFields"
import { useUpdateUserProfileFields } from "app/Scenes/MyProfile/useUpdateUserProfileFields"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FormikProvider, useFormik } from "formik"
import { useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface SharedProps {
  message: string
  onClose: () => void
}

interface MyProfileEditModalProps extends SharedProps {
  visible: boolean
}

interface MyProfileEditModalContentProps extends SharedProps {
  me: MyProfileEditModal_me$key
}

export const MyProfileEditModal: React.FC<MyProfileEditModalProps> = ({
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

  return (
    <AutomountedBottomSheetModal visible={visible} onDismiss={onClose} enableDynamicSizing>
      <BottomSheetScrollView keyboardShouldPersistTaps="always">
        <MyProfileEditModalWithSuspense onClose={onClose} message={message} />
      </BottomSheetScrollView>
    </AutomountedBottomSheetModal>
  )
}

const MyProfileEditModalWithSuspense: React.FC<SharedProps> = withSuspense(
  ({ message, onClose }) => {
    const data = useLazyLoadQuery<MyProfileEditModalQuery>(
      graphql`
        query MyProfileEditModalQuery {
          me @required(action: NONE) {
            ...MyProfileEditModal_me
          }
        }
      `,
      {}
    )

    if (!data?.me) {
      return null
    }

    return <MyProfileEditModalContent me={data.me} onClose={onClose} message={message} />
  },
  () => <MyProfileEditModalSkeleton />
)

const MyProfileEditModalContent: React.FC<MyProfileEditModalContentProps> = ({
  me,
  message,
  onClose,
}) => {
  const data = useFragment(meFragmentQuery, me)

  const [loading, setLoading] = useState<boolean>(false)
  const { trackEvent } = useTracking()

  // TODO: what am I suposed to do with inProgress?
  const [commit, _inProgress] = useUpdateUserProfileFields()

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
          },
        },
        onCompleted: () => {
          trackEvent(tracks.editedUserProfile())
          setLoading(false)
          onClose()
        },
        onError: () => {
          // TODO: display an error message to user
          console.log("Error updating user profile")
          setLoading(false)
        },
      })
    },
    validationSchema: userProfileYupSchema,
  })

  const { handleSubmit, isValid } = formikBag
  return (
    <Box p={2} testID="my-profile-edit-modal-content">
      <Text>{message}</Text>
      <FormikProvider value={formikBag}>
        <UserProfileFields bottomSheetInput />
        <Button block mt={2} mb={4} onPress={handleSubmit} disabled={!isValid} loading={loading}>
          Save and Continue
        </Button>
      </FormikProvider>
    </Box>
  )
}

const MyProfileEditModalSkeleton = () => {
  return (
    <Skeleton>
      <Box p={2}>
        <Spacer y={0.5} />
        <SkeletonText>
          Tell us a few more details about yourself to complete your profile.
        </SkeletonText>
        <Spacer y={2} />
        <SkeletonBox width="100%" height={60} borderRadius={4}>
          {/* Full name */}
        </SkeletonBox>
        <Spacer y={4} />
        <SkeletonBox width="100%" height={60} borderRadius={4}>
          {/* Primary location */}
        </SkeletonBox>
        <Spacer y={4} />
        <SkeletonBox width="100%" height={60} borderRadius={4}>
          {/* Profession */}
        </SkeletonBox>
        <Spacer y={4} />
        <SkeletonBox width="100%" height={60} borderRadius={4}>
          {/* Other Relevant Positions */}
        </SkeletonBox>
        <Spacer y={2} />
        <SkeletonBox width="100%" height={50} borderRadius={50}>
          {/* Save and Continue */}
        </SkeletonBox>
      </Box>
    </Skeleton>
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
