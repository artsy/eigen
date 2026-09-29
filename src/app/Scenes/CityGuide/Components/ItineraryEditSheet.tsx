import { Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { CityItinerariesQuery } from "__generated__/CityItinerariesQuery.graphql"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { ItineraryEditSheetUpdateMutation } from "__generated__/ItineraryEditSheetUpdateMutation.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useToast } from "app/Components/Toast/toastHook"
import { CityItinerariesScreenQuery } from "app/Scenes/CityGuide/Screens/CityItineraries"
import {
  itineraryCoverKey,
  useItineraryLocalCover,
} from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import { refetchCityGuideItinerariesRail } from "app/Scenes/CityGuide/utils/CityGuideItinerariesRailQuery"
import { storeLocalImage } from "app/utils/LocalImageStore"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import BottomSheetKeyboardAwareScrollView from "app/utils/keyboard/BottomSheetKeyboardAwareScrollView"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useState } from "react"
import { Image as PickedImage } from "react-native-image-crop-picker"
import {
  ConnectionHandler,
  fetchQuery,
  graphql,
  useMutation,
  useRelayEnvironment,
} from "react-relay"

const NOTES_LIMIT = 200
const COVER_SIZE = 60

interface Props {
  visible: boolean
  onClose: () => void
  itinerary: {
    internalID: string
    name: string
    /** The designs label this "Notes"; it is the itinerary's `description`. */
    description?: string | null
    coverImageUrl?: string | null
  }
  /**
   * Identifies the `CityItineraries_itinerariesConnection` to evict a deleted itinerary from and
   * reload, so the itineraries list isn't left stale. Safe to pass even when that list was never
   * loaded — both are skipped if the connection isn't in the Relay store.
   */
  citySlug: string
  /** Called after a successful delete, so the caller can leave the screen or refresh. */
  onDeleted?: () => void
  /** Called after a new cover is saved and stored on the device, so the caller can show it. */
  onCoverSaved?: () => void
}

/**
 * The "Edit Itinerary" sheet: rename it, edit its notes, change its cover image, or delete it.
 *
 * Reachable from the itineraries list, which queries through `me` and so always owns what it
 * is editing, and from the itinerary's own detail page, gated there by `Query.itinerary`'s
 * `isMine` field.
 */
export const ItineraryEditSheet: React.FC<Props> = ({
  visible,
  onClose,
  itinerary,
  citySlug,
  onDeleted,
  onCoverSaved,
}) => {
  const toast = useToast()
  const environment = useRelayEnvironment()
  const { showActionSheetWithOptions } = useActionSheet()
  const [name, setName] = useState(itinerary.name)
  const [notes, setNotes] = useState(itinerary.description ?? "")
  const [cover, setCover] = useState<PickedImage>()
  const [isUploading, setIsUploading] = useState(false)
  const savedCover = useItineraryLocalCover(itinerary.internalID)
  const localCoverPath = cover?.path ?? savedCover?.path
  const coverUrl = localCoverPath ?? itinerary.coverImageUrl

  const [commitUpdate, isUpdating] = useMutation<ItineraryEditSheetUpdateMutation>(updateMutation)
  const [commitDelete, isDeleting] = useMutation<ItineraryEditSheetDeleteMutation>(deleteMutation)

  const chooseCover = () => {
    showPhotoActionSheet(showActionSheetWithOptions, true, false)
      .then(([image]) => image && setCover(image))
      .catch((error) => console.error("Could not pick an itinerary cover", error))
  }

  const save = async () => {
    let imageURL: string | undefined

    if (cover) {
      setIsUploading(true)
      try {
        imageURL = await getConvertedImageUrlFromS3(cover.path)
      } catch (error) {
        console.error("Could not upload the itinerary cover", error)
        toast.show("Could not save your changes", "bottom")
        return
      } finally {
        setIsUploading(false)
      }
    }

    commitUpdate({
      variables: {
        input: { id: itinerary.internalID, title: name, description: notes, imageURL },
      },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          toast.show("Could not save your changes", "bottom")
          return
        }

        if (cover) {
          storeLocalImage(itineraryCoverKey(itinerary.internalID), cover).then(onCoverSaved)
        }

        onClose()
      },
      onError: () => toast.show("Could not save your changes", "bottom"),
    })
  }

  const destroy = () => {
    let isListLoaded = false

    commitDelete({
      variables: { input: { id: itinerary.internalID } },
      updater: (store, data) => {
        const responseOrError = data?.deleteItinerary?.responseOrError

        if (responseOrError?.__typename !== "ItineraryMutationSuccess") {
          return
        }

        const deletedItineraryId = responseOrError.itinerary?.id
        const me = store.getRoot().getLinkedRecord("me")
        const connection =
          me &&
          ConnectionHandler.getConnection(me, "CityItineraries_itinerariesConnection", {
            citySlug,
          })

        isListLoaded = !!connection

        if (connection && deletedItineraryId) {
          ConnectionHandler.deleteNode(connection, deletedItineraryId)
        }
      },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          toast.show("Could not delete this itinerary", "bottom")
          return
        }

        // The rail reads `me.itinerariesConnection` without a connection key, so the eviction
        // above never reaches it.
        refetchCityGuideItinerariesRail(environment, citySlug).catch(() => undefined)

        // The list pages by offset, so one fewer row shifts every later page back by one and
        // its next `loadNext` would skip an itinerary. Reloading the first page resets the cursor.
        if (isListLoaded) {
          fetchQuery<CityItinerariesQuery>(
            environment,
            CityItinerariesScreenQuery,
            { citySlug },
            { fetchPolicy: "network-only" }
          ).subscribe({})
        }

        onClose()
        onDeleted?.()
      },
      onError: () => toast.show("Could not delete this itinerary", "bottom"),
    })
  }

  return (
    <AutomountedBottomSheetModal
      sentryName="ItineraryEditSheet"
      visible={visible}
      onDismiss={onClose}
      enableDynamicSizing
    >
      <BottomSheetKeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <Flex pt={1} pb={2}>
          <Flex px={2} pb={2}>
            <Text variant="md">Edit Itinerary</Text>
          </Flex>

          <Touchable
            testID="itinerary-edit-cover"
            accessibilityRole="button"
            onPress={chooseCover}
            disabled={isUploading}
          >
            <Flex px={2} pb={2} flexDirection="row" alignItems="center" gap={2}>
              <Flex
                width={COVER_SIZE}
                height={COVER_SIZE}
                borderRadius={8}
                overflow="hidden"
                backgroundColor="mono10"
              >
                {!!coverUrl && (
                  <Image
                    testID="itinerary-edit-cover-image"
                    src={coverUrl}
                    performResize={!localCoverPath}
                    width={COVER_SIZE}
                    height={COVER_SIZE}
                    resizeMode="cover"
                  />
                )}
              </Flex>

              <Text variant="sm" underline>
                {coverUrl ? "Change cover photo" : "Add cover photo"}
              </Text>
            </Flex>
          </Touchable>

          <Flex px={2} gap={2}>
            <BottomSheetInput
              title="Name"
              defaultValue={name}
              onChangeText={setName}
              testID="itinerary-edit-name"
            />

            <Flex>
              <BottomSheetInput
                title="Notes"
                defaultValue={notes}
                onChangeText={setNotes}
                multiline
                maxLength={NOTES_LIMIT}
                testID="itinerary-edit-notes"
              />

              <Text variant="xs" color="mono60" textAlign="right" mt={0.5}>
                {`${notes.length} / ${NOTES_LIMIT}`}
              </Text>
            </Flex>
          </Flex>

          <Flex px={2} pt={2} gap={2}>
            <Button
              block
              testID="itinerary-edit-save"
              loading={isUploading || isUpdating}
              disabled={!name.trim()}
              onPress={save}
            >
              Save Changes
            </Button>

            {/* Red and underlined, per the designs — a text link rather than a button. */}
            <Touchable
              testID="itinerary-edit-delete"
              accessibilityRole="button"
              accessibilityLabel="Delete Itinerary"
              disabled={isDeleting}
              onPress={destroy}
            >
              <Text variant="sm" color="red100" textAlign="center" underline>
                Delete Itinerary
              </Text>
            </Touchable>
          </Flex>
        </Flex>
      </BottomSheetKeyboardAwareScrollView>
    </AutomountedBottomSheetModal>
  )
}

const updateMutation = graphql`
  mutation ItineraryEditSheetUpdateMutation($input: updateItineraryInput!) {
    updateItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            internalID
            title
            description
          }
        }
        ... on ItineraryMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const deleteMutation = graphql`
  mutation ItineraryEditSheetDeleteMutation($input: deleteItineraryInput!) {
    deleteItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            id
          }
        }
        ... on ItineraryMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
