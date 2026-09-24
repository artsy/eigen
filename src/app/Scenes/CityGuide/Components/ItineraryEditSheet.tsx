import { Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { ItineraryEditSheetUpdateMutation } from "__generated__/ItineraryEditSheetUpdateMutation.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useToast } from "app/Components/Toast/toastHook"
import {
  isLocalImagePath,
  itineraryCoverImageKey,
  useItineraryLocalCover,
} from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import { removeLocalImage, storeLocalImage } from "app/utils/LocalImageStore"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import BottomSheetKeyboardAwareScrollView from "app/utils/keyboard/BottomSheetKeyboardAwareScrollView"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useState } from "react"
import { Image as PickedImage } from "react-native-image-crop-picker"
import {
  commitLocalUpdate,
  commitMutation,
  ConnectionHandler,
  graphql,
  useMutation,
  useRelayEnvironment,
} from "react-relay"
import { IEnvironment } from "relay-runtime"

const NOTES_LIMIT = 200
const COVER_SIZE = 80

type LocalCover = Pick<PickedImage, "path" | "width" | "height">

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
    saveItinerary(
      environment,
      itinerary,
      { title: name, description: notes, cover: localCover ?? (coverRemoved ? null : undefined) },
      () => toast.show("Could not save your changes", "bottom")
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

interface ItineraryChanges {
  title: string
  description: string
  /** `undefined` leaves the cover as it is; `null` removes it. */
  cover: LocalCover | null | undefined
}

/**
 * Shows the changes in the store at once, then uploads any new photo and sends one mutation.
 * Any failure puts back what the store held before.
 */
const saveItinerary = async (
  environment: IEnvironment,
  { id, internalID }: Props["itinerary"],
  { title, description, cover }: ItineraryChanges,
  onError: () => void
) => {
  const coverKey = itineraryCoverImageKey(internalID)
  let snapshot: { title: string; description: string | null; heroImageID?: string } | undefined

  commitLocalUpdate(environment, (store) => {
    const record = store.get(id)

    if (!record) {
      return
    }

    snapshot = {
      title: record.getValue("title") as string,
      description: record.getValue("description") as string | null,
      heroImageID: record.getLinkedRecord("heroImage")?.getDataID(),
    }
    record.setValue(title, "title")
    record.setValue(description, "description")

    if (cover === null) {
      record.setValue(null, "heroImage")
    } else if (cover) {
      // A record of its own per photo, so a rollback can link the untouched old image back.
      const localID = `client:${id}:localCover:${cover.path}`
      const heroImage = store.get(localID) ?? store.create(localID, "Image")

      heroImage.setValue(cover.path, 'url(version:"large")')
      heroImage.setValue(cover.path, 'url(version:"small")')
      heroImage.setValue(cover.width, "width")
      heroImage.setValue(cover.height, "height")
      heroImage.setValue((cover.width || 1) / (cover.height || 1), "aspectRatio")
      heroImage.setValue(null, "blurhash")
      record.setLinkedRecord(heroImage, "heroImage")
    }
  })

  try {
    if (cover) {
      await storeLocalImage(coverKey, cover)
    } else if (cover === null) {
      await removeLocalImage(coverKey)
    }

    const imageURL = cover ? await getConvertedImageUrlFromS3(cover.path) : null

    await new Promise<void>((resolve, reject) => {
      commitMutation<ItineraryEditSheetUpdateMutation>(environment, {
        mutation: updateMutation,
        variables: {
          input: {
            id: internalID,
            title,
            description,
            ...(cover !== undefined && { imageURL }),
          },
        },
        onCompleted: (response, errors) => {
          const success =
            response.updateItinerary?.responseOrError?.__typename === "ItineraryMutationSuccess"

          if (errors?.length || !success) {
            reject(errors?.[0] ?? new Error("updateItinerary failed"))
          } else {
            resolve()
          }
        },
        onError: reject,
      })
    })
  } catch (error) {
    console.error("Failed to save the itinerary", error)

    if (cover) {
      await removeLocalImage(coverKey)
    }

    commitLocalUpdate(environment, (store) => {
      const record = store.get(id)

      if (!record || !snapshot) {
        return
      }

      record.setValue(snapshot.title, "title")
      record.setValue(snapshot.description, "description")

      const heroImage = snapshot.heroImageID && store.get(snapshot.heroImageID)

      if (heroImage) {
        record.setLinkedRecord(heroImage, "heroImage")
      } else {
        record.setValue(null, "heroImage")
      }
    })

    onError()
  }
}

// No `heroImage`: Gravity builds a new cover's versions in the background, so the response
// would still carry the old image over the local one.
const updateMutation = graphql`
  mutation ItineraryEditSheetUpdateMutation($input: updateItineraryInput!) {
    updateItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            id
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
