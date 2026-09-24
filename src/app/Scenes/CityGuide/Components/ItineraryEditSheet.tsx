import { Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { ItineraryEditSheetUpdateCoverMutation } from "__generated__/ItineraryEditSheetUpdateCoverMutation.graphql"
import { ItineraryEditSheetUpdateMutation } from "__generated__/ItineraryEditSheetUpdateMutation.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useToast } from "app/Components/Toast/toastHook"
import {
  isLocalImagePath,
  itineraryCoverImageKey,
  useItineraryLocalCover,
} from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import {
  isItineraryDeleted,
  markItineraryDeleted,
  queueItinerarySave,
  useHasPendingItinerarySave,
} from "app/Scenes/CityGuide/utils/itinerarySaveQueue"
import {
  getLocalImage,
  LocalImage,
  removeLocalImage,
  storeLocalImage,
} from "app/utils/LocalImageStore"
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
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime"

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

interface ItineraryChanges {
  title: string
  description: string
  /** `undefined` leaves the cover as it is; `null` removes it. */
  cover: LocalCover | null | undefined
}

/**
 * Shows the changes in the store right away. The title and notes go to Gravity at once; a cover
 * change goes in its own mutation, queued behind earlier cover saves for the same itinerary.
 */
const saveItineraryChanges = (
  environment: Environment,
  itinerary: { id: string; internalID: string },
  { title, description, cover }: ItineraryChanges,
  showToast: (message: string) => void
) => {
  saveItineraryText(environment, itinerary, { title, description }, showToast)

  if (cover !== undefined) {
    saveItineraryCover(environment, itinerary, cover, showToast)
  }
}

const saveItineraryText = (
  environment: Environment,
  itinerary: { id: string; internalID: string },
  { title, description }: Pick<ItineraryChanges, "title" | "description">,
  showToast: (message: string) => void
) => {
  let previous: { title: string; description: string | null } | undefined

  commitLocalUpdate(environment, (store) => {
    const record = store.get(itinerary.id)

    if (!record) {
      return
    }

    previous = {
      title: record.getValue("title") as string,
      description: record.getValue("description") as string | null,
    }

    record.setValue(title, "title")
    record.setValue(description, "description")
  })

  const fail = () => {
    commitLocalUpdate(environment, (store) => {
      const record = store.get(itinerary.id)

      if (!record || !previous) {
        return
      }

      record.setValue(previous.title, "title")
      record.setValue(previous.description, "description")
    })

    if (!isItineraryDeleted(itinerary.internalID)) {
      showToast("Could not save your changes")
    }
  }

  commitMutation<ItineraryEditSheetUpdateMutation>(environment, {
    mutation: updateMutation,
    variables: { input: { id: itinerary.internalID, title, description } },
    onCompleted: (response, errors) => {
      if (
        errors?.length ||
        response.updateItinerary?.responseOrError?.__typename !== "ItineraryMutationSuccess"
      ) {
        fail()
      }
    },
    onError: fail,
  })
}

interface CoverBaseline {
  heroImageID: string | null
  localImage: Promise<LocalImage | null>
}

/**
 * Per itinerary, the cover to put back if the latest of its queued cover saves fails: the one
 * shown before the first of them, or the last one Gravity accepted.
 */
const coverBaselines = new Map<string, CoverBaseline>()

const saveItineraryCover = (
  environment: Environment,
  itinerary: { id: string; internalID: string },
  cover: LocalCover | null,
  showToast: (message: string) => void
) => {
  const { id, internalID } = itinerary
  const coverKey = itineraryCoverImageKey(internalID)

  if (!coverBaselines.has(internalID)) {
    coverBaselines.set(internalID, {
      heroImageID: readHeroImageID(environment, id),
      // Read before this save's local write below, which AsyncStorage runs after it.
      localImage: getLocalImage(coverKey).catch(() => null),
    })
  }

  // Before the store write: readers re-read LocalImageStore when the cover URL changes.
  const shown = (async () => {
    try {
      if (cover) {
        await storeLocalImage(coverKey, cover)
      } else {
        await removeLocalImage(coverKey)
      }
    } catch (error) {
      console.error("Failed to store the itinerary cover locally", error)
    }

    commitLocalUpdate(environment, (store) => {
      const record = store.get(id)

      if (record) {
        writeCover(store, record, cover)
      }
    })
  })()

  queueItinerarySave(internalID, async (isLatest) => {
    const fail = async (message: string) => {
      const baseline = coverBaselines.get(internalID)

      if (!baseline || !isLatest() || isItineraryDeleted(internalID)) {
        return
      }

      const localImage = await baseline.localImage

      try {
        if (localImage) {
          await storeLocalImage(coverKey, localImage)
        } else {
          await removeLocalImage(coverKey)
        }
      } catch (error) {
        console.error("Failed to restore the itinerary cover locally", error)
      }

      // A save made during the restore above now owns the cover.
      if (!isLatest()) {
        return
      }

      commitLocalUpdate(environment, (store) => {
        const record = store.get(id)
        const heroImage = baseline.heroImageID ? store.get(baseline.heroImageID) : null

        if (record && heroImage) {
          record.setLinkedRecord(heroImage, "heroImage")
        } else {
          record?.setValue(null, "heroImage")
        }
      })

      showToast(message)
    }

    try {
      await shown

      if (isItineraryDeleted(internalID)) {
        return
      }

      let imageURL: string | null = null

      if (cover) {
        try {
          imageURL = await getConvertedImageUrlFromS3(cover.path)
        } catch (error) {
          console.error("Failed to upload itinerary cover image", error)
          await fail("Could not upload your photo")
          return
        }
      }

      if (isItineraryDeleted(internalID)) {
        return
      }

      if (await commitCoverMutation(environment, internalID, imageURL)) {
        coverBaselines.set(internalID, {
          heroImageID: cover ? localCoverRecordID(id, cover.path) : null,
          localImage: Promise.resolve(cover),
        })
      } else {
        await fail("Could not save your changes")
      }
    } finally {
      if (isLatest()) {
        coverBaselines.delete(internalID)
      }
    }
  })
}

const readHeroImageID = (environment: Environment, recordID: string) => {
  let heroImageID: string | null = null

  commitLocalUpdate(environment, (store) => {
    heroImageID = store.get(recordID)?.getLinkedRecord("heroImage")?.getDataID() ?? null
  })

  return heroImageID
}

/** Sends only the cover, so a slow upload can't bring back an older title or notes. */
const commitCoverMutation = (
  environment: Environment,
  internalID: string,
  imageURL: string | null
) =>
  new Promise<boolean>((resolve) => {
    commitMutation<ItineraryEditSheetUpdateCoverMutation>(environment, {
      mutation: updateCoverMutation,
      variables: { input: { id: internalID, imageURL } },
      onCompleted: (response, errors) =>
        resolve(
          !errors?.length &&
            response.updateItinerary?.responseOrError?.__typename === "ItineraryMutationSuccess"
        ),
      onError: () => resolve(false),
    })
  })

const localCoverRecordID = (recordID: string, path: string) =>
  `client:${recordID}:localCover:${path}`

/**
 * Links a client record of its own per photo rather than editing the current one in place, so
 * a failed save can link the untouched previous image back.
 */
const writeCover = (store: RecordSourceProxy, record: RecordProxy, cover: LocalCover | null) => {
  if (!cover) {
    record.setValue(null, "heroImage")
    return
  }

  const { path, width, height } = cover
  const localID = localCoverRecordID(record.getDataID(), path)
  const heroImage = store.get(localID) ?? store.create(localID, "Image")

  heroImage.setValue(path, 'url(version:"large")')
  heroImage.setValue(path, 'url(version:"small")')
  heroImage.setValue(width, "width")
  heroImage.setValue(height, "height")
  heroImage.setValue((width || 1) / (height || 1), "aspectRatio")
  heroImage.setValue(null, "blurhash")
  record.setLinkedRecord(heroImage, "heroImage")
}

// Neither mutation selects `heroImage`: Gravity builds a new cover's versions in a background
// job, so the response would still carry the old image over the local one.
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

const updateCoverMutation = graphql`
  mutation ItineraryEditSheetUpdateCoverMutation($input: updateItineraryInput!) {
    updateItinerary(input: $input) {
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
