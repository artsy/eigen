import { Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useToast } from "app/Components/Toast/toastHook"
import {
  isLocalImagePath,
  useItineraryLocalCover,
} from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import { LocalCover, saveItineraryChanges } from "app/Scenes/CityGuide/utils/itinerarySave"
import {
  markItineraryDeleted,
  useHasPendingItinerarySave,
} from "app/Scenes/CityGuide/utils/itinerarySaveQueue"
import BottomSheetKeyboardAwareScrollView from "app/utils/keyboard/BottomSheetKeyboardAwareScrollView"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useState } from "react"
import { ConnectionHandler, graphql, useMutation, useRelayEnvironment } from "react-relay"

const NOTES_LIMIT = 200
const COVER_SIZE = 80

interface Props {
  visible: boolean
  onClose: () => void
  itinerary: {
    /** The Relay record id, so a save can update the store before the server answers. */
    id: string
    internalID: string
    name: string
    /** The designs label this "Notes"; it is the itinerary's `description`. */
    description?: string | null
    heroImage?: { url?: string | null } | null
  }
  /**
   * Identifies the `CityItineraries_itinerariesConnection` to evict a deleted itinerary from,
   * so the itineraries list isn't left showing it stale. Safe to pass even when that list was
   * never loaded — the eviction is a no-op if the connection isn't in the Relay store.
   */
  citySlug: string
  /** Called after a successful delete, so the caller can leave the screen or refresh. */
  onDeleted?: () => void
}

/**
 * The "Edit Itinerary" sheet: rename it, edit its notes, change or remove its cover image, or
 * delete it.
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
}) => {
  const toast = useToast()
  const environment = useRelayEnvironment()
  const { showActionSheetWithOptions } = useActionSheet()
  const [name, setName] = useState(itinerary.name)
  const [notes, setNotes] = useState(itinerary.description ?? "")
  // A newly picked, not-yet-uploaded local image, shown as an optimistic preview.
  const [localCover, setLocalCover] = useState<LocalCover>()
  // True once the user has explicitly removed the cover, so save sends `imageURL: null`.
  const [coverRemoved, setCoverRemoved] = useState(false)

  const [commitDelete, isDeleting] = useMutation<ItineraryEditSheetDeleteMutation>(deleteMutation)
  // A delete during a queued cover save would leave that save failing on a missing itinerary.
  const hasPendingSave = useHasPendingItinerarySave(itinerary.internalID)

  const currentCoverUrl = itinerary.heroImage?.url ?? null
  const savedLocalCover = useItineraryLocalCover(itinerary.internalID, currentCoverUrl)
  const coverImageUrl =
    localCover?.path || (coverRemoved ? null : savedLocalCover?.path || currentCoverUrl)
  const hasCover = !!coverImageUrl

  const chooseCoverImage = () => {
    showPhotoActionSheet(showActionSheetWithOptions, true, false)
      .then((images) => {
        if (images?.length >= 1) {
          const { path, width, height } = images[0]
          setLocalCover({ path, width, height })
          setCoverRemoved(false)
        }
      })
      .catch((error) =>
        console.error("Error when picking an itinerary cover image", JSON.stringify(error))
      )
  }

  const removeCoverImage = () => {
    setLocalCover(undefined)
    setCoverRemoved(true)
  }

  // The sheet closes straight away; the upload and the mutation carry on without it.
  const save = () => {
    saveItineraryChanges(
      environment,
      itinerary,
      { title: name, description: notes, cover: localCover ?? (coverRemoved ? null : undefined) },
      (message) => toast.show(message, "bottom")
    )
    onClose()
  }

  const destroy = () => {
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

        if (connection && deletedItineraryId) {
          ConnectionHandler.deleteNode(connection, deletedItineraryId)
        }
      },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          toast.show("Could not delete this itinerary", "bottom")
          return
        }

        markItineraryDeleted(itinerary.internalID)
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

          <Flex px={2} pb={2} flexDirection="row" alignItems="center" gap={2}>
            <Touchable
              testID="itinerary-edit-cover"
              onPress={chooseCoverImage}
              // The "Change/Add cover photo" link next to it does the same, so screen readers
              // skip this swatch rather than read a second, identical button.
              accessible={false}
            >
              <Flex
                width={COVER_SIZE}
                height={COVER_SIZE}
                borderRadius={8}
                backgroundColor="mono10"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
              >
                {coverImageUrl ? (
                  <Image
                    testID="itinerary-edit-cover-image"
                    src={coverImageUrl}
                    performResize={!isLocalImagePath(coverImageUrl)}
                    width={COVER_SIZE}
                    height={COVER_SIZE}
                    resizeMode="cover"
                  />
                ) : (
                  <Text variant="xs" color="mono60" textAlign="center">
                    No cover
                  </Text>
                )}
              </Flex>
            </Touchable>

            <Flex gap={0.5}>
              <Touchable
                testID="itinerary-edit-cover-change"
                accessibilityRole="button"
                accessibilityLabel={hasCover ? "Change cover photo" : "Add cover photo"}
                onPress={chooseCoverImage}
              >
                <Text variant="sm" underline>
                  {hasCover ? "Change cover photo" : "Add cover photo"}
                </Text>
              </Touchable>

              {!!hasCover && (
                <Touchable
                  testID="itinerary-edit-cover-remove"
                  accessibilityRole="button"
                  onPress={removeCoverImage}
                >
                  <Text variant="sm" color="red100" underline>
                    Remove cover photo
                  </Text>
                </Touchable>
              )}
            </Flex>
          </Flex>

          <Flex px={2} gap={2}>
            <BottomSheetInput
              title="Name"
              value={name}
              onChangeText={setName}
              testID="itinerary-edit-name"
            />

            <Flex>
              <BottomSheetInput
                title="Notes"
                value={notes}
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
            <Button block testID="itinerary-edit-save" disabled={!name.trim()} onPress={save}>
              Save Changes
            </Button>

            {/* Red and underlined, per the designs — a text link rather than a button. */}
            <Touchable
              testID="itinerary-edit-delete"
              accessibilityRole="button"
              accessibilityLabel="Delete Itinerary"
              disabled={isDeleting || hasPendingSave}
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
