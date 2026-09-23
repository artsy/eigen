import { Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { ItineraryEditSheetUpdateMutation } from "__generated__/ItineraryEditSheetUpdateMutation.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useToast } from "app/Components/Toast/toastHook"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import BottomSheetKeyboardAwareScrollView from "app/utils/keyboard/BottomSheetKeyboardAwareScrollView"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useState } from "react"
import { ConnectionHandler, graphql, useMutation } from "react-relay"

const NOTES_LIMIT = 200
const COVER_SIZE = 80

interface Props {
  visible: boolean
  onClose: () => void
  itinerary: {
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
  const { showActionSheetWithOptions } = useActionSheet()
  const [name, setName] = useState(itinerary.name)
  const [notes, setNotes] = useState(itinerary.description ?? "")
  // A newly picked, not-yet-uploaded local image path, shown as an optimistic preview.
  const [localCoverPath, setLocalCoverPath] = useState<string>()
  // True once the user has explicitly removed the cover, so save sends `imageURL: null`.
  const [coverRemoved, setCoverRemoved] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const [commitUpdate, isUpdating] = useMutation<ItineraryEditSheetUpdateMutation>(updateMutation)
  const [commitDelete, isDeleting] = useMutation<ItineraryEditSheetDeleteMutation>(deleteMutation)

  const currentCoverUrl = itinerary.heroImage?.url ?? null
  const coverImageUrl = localCoverPath || (coverRemoved ? null : currentCoverUrl)
  const hasCover = !!coverImageUrl
  const isSaving = isUpdating || isUploadingCover

  const chooseCoverImage = () => {
    showPhotoActionSheet(showActionSheetWithOptions, true, false)
      .then((images) => {
        if (images?.length >= 1) {
          setLocalCoverPath(images[0].path)
          setCoverRemoved(false)
        }
      })
      .catch((error) =>
        console.error("Error when picking an itinerary cover image", JSON.stringify(error))
      )
  }

  const removeCoverImage = () => {
    setLocalCoverPath(undefined)
    setCoverRemoved(true)
  }

  const save = async () => {
    try {
      // `undefined` here means "leave the cover as it is" — only send `imageURL` when the
      // user actually picked or removed a photo.
      let imageURL: string | null | undefined

      if (localCoverPath) {
        setIsUploadingCover(true)
        imageURL = await getConvertedImageUrlFromS3(localCoverPath)
      } else if (coverRemoved) {
        imageURL = null
      }

      commitUpdate({
        variables: {
          input: {
            id: itinerary.internalID,
            title: name,
            description: notes,
            ...(imageURL !== undefined ? { imageURL } : {}),
          },
        },
        // Gravity builds the cover's versions in a background job, so the response still has
        // the old image: show the local photo (or no cover) straight away.
        updater:
          imageURL === undefined
            ? undefined
            : (store, data) => {
                const responseOrError = data?.updateItinerary?.responseOrError

                if (responseOrError?.__typename !== "ItineraryMutationSuccess") {
                  return
                }

                const updatedItineraryId = responseOrError.itinerary?.id
                const record = updatedItineraryId ? store.get(updatedItineraryId) : null
                const heroImage =
                  imageURL === null
                    ? record?.getLinkedRecord("heroImage")
                    : record?.getOrCreateLinkedRecord("heroImage", "Image")
                const newUrl = imageURL === null ? null : localCoverPath

                heroImage?.setValue(newUrl, 'url(version:"large")')
                heroImage?.setValue(newUrl, 'url(version:"small")')
              },
        onCompleted: (_response, errors) => {
          if (errors?.length) {
            toast.show("Could not save your changes", "bottom")
            return
          }

          onClose()
        },
        onError: () => toast.show("Could not save your changes", "bottom"),
      })
    } catch (error) {
      console.error("Failed to upload itinerary cover image", error)
      toast.show("Could not upload your photo", "bottom")
    } finally {
      setIsUploadingCover(false)
    }
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
              disabled={isSaving}
              onPress={chooseCoverImage}
              // The "Change cover photo" link next to it does the same, so screen readers
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
                disabled={isSaving}
                onPress={chooseCoverImage}
              >
                <Text variant="sm" underline>
                  Change cover photo
                </Text>
              </Touchable>

              {!!hasCover && (
                <Touchable
                  testID="itinerary-edit-cover-remove"
                  accessibilityRole="button"
                  disabled={isSaving}
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
            <Button
              block
              testID="itinerary-edit-save"
              loading={isSaving}
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
              disabled={isDeleting || isSaving}
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
            id
            internalID
            title
            description
            heroImage {
              url(version: "large")
              height
              width
              aspectRatio
              blurhash
              smallUrl: url(version: "small")
            }
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
