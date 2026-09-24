import { itinerarySaveUpdateCoverMutation } from "__generated__/itinerarySaveUpdateCoverMutation.graphql"
import { itinerarySaveUpdateMutation } from "__generated__/itinerarySaveUpdateMutation.graphql"
import { itineraryCoverImageKey } from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import {
  isItineraryDeleted,
  queueItinerarySave,
} from "app/Scenes/CityGuide/utils/itinerarySaveQueue"
import {
  getLocalImage,
  LocalImage,
  removeLocalImage,
  storeLocalImage,
} from "app/utils/LocalImageStore"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { Image as PickedImage } from "react-native-image-crop-picker"
import { commitLocalUpdate, commitMutation, graphql } from "react-relay"
import { IEnvironment, RecordProxy, RecordSourceProxy } from "relay-runtime"

export type LocalCover = Pick<PickedImage, "path" | "width" | "height">

interface SavedItinerary {
  /** The Relay record id, so a save can update the store before the server answers. */
  id: string
  internalID: string
}

export interface ItineraryChanges {
  title: string
  description: string
  /** `undefined` leaves the cover as it is; `null` removes it. */
  cover: LocalCover | null | undefined
}

/**
 * Shows the changes in the store right away. Changed title and notes go to Gravity at once; a
 * cover change goes in its own mutation, queued behind earlier cover saves for the same itinerary.
 */
export const saveItineraryChanges = (
  environment: IEnvironment,
  itinerary: SavedItinerary,
  { title, description, cover }: ItineraryChanges,
  showToast: (message: string) => void
) => {
  saveItineraryText(environment, itinerary, { title, description }, showToast)

  if (cover !== undefined) {
    saveItineraryCover(environment, itinerary, cover, showToast)
  }
}

interface ItineraryText {
  title: string
  description: string | null
}

interface TextSave {
  /** The latest text save for the itinerary; only that one may roll back or toast. */
  seq: number
  /** The text before the first pending save, or the last one Gravity accepted. */
  baseline?: ItineraryText
}

// Keyed by itinerary internalID and kept for the JS session; safe only because those ids are unique.
const textSaves = new Map<string, TextSave>()
let lastTextSaveSeq = 0

const saveItineraryText = (
  environment: IEnvironment,
  { id, internalID }: SavedItinerary,
  { title, description }: Pick<ItineraryChanges, "title" | "description">,
  showToast: (message: string) => void
) => {
  let previous: ItineraryText | undefined
  let unchanged = false

  commitLocalUpdate(environment, (store) => {
    const record = store.get(id)

    if (!record) {
      return
    }

    previous = {
      title: record.getValue("title") as string,
      description: record.getValue("description") as string | null,
    }
    unchanged = previous.title === title && (previous.description ?? "") === description

    if (!unchanged) {
      record.setValue(title, "title")
      record.setValue(description, "description")
    }
  })

  if (unchanged) {
    return
  }

  const seq = ++lastTextSaveSeq
  const baseline = textSaves.get(internalID)?.baseline ?? previous

  textSaves.set(internalID, { seq, baseline })

  const succeed = () => {
    const save = textSaves.get(internalID)

    if (save?.seq === seq) {
      textSaves.delete(internalID)
    } else if (save) {
      save.baseline = { title, description }
    }
  }

  const fail = () => {
    const save = textSaves.get(internalID)

    if (save?.seq !== seq) {
      return
    }

    textSaves.delete(internalID)

    commitLocalUpdate(environment, (store) => {
      const record = store.get(id)

      if (record && save.baseline) {
        record.setValue(save.baseline.title, "title")
        record.setValue(save.baseline.description, "description")
      }
    })

    if (!isItineraryDeleted(internalID)) {
      showToast("Could not save your changes")
    }
  }

  commitMutation<itinerarySaveUpdateMutation>(environment, {
    mutation: updateMutation,
    variables: { input: { id: internalID, title, description } },
    onCompleted: (response, errors) => {
      if (
        errors?.length ||
        response.updateItinerary?.responseOrError?.__typename !== "ItineraryMutationSuccess"
      ) {
        fail()
      } else {
        succeed()
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
 * Keyed by itinerary internalID and kept for the JS session; safe only because those ids are unique.
 */
const coverBaselines = new Map<string, CoverBaseline>()

const saveItineraryCover = (
  environment: IEnvironment,
  { id, internalID }: SavedItinerary,
  cover: LocalCover | null,
  showToast: (message: string) => void
) => {
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

const readHeroImageID = (environment: IEnvironment, recordID: string) => {
  let heroImageID: string | null = null

  commitLocalUpdate(environment, (store) => {
    heroImageID = store.get(recordID)?.getLinkedRecord("heroImage")?.getDataID() ?? null
  })

  return heroImageID
}

/** Sends only the cover, so a slow upload can't bring back an older title or notes. */
const commitCoverMutation = (
  environment: IEnvironment,
  internalID: string,
  imageURL: string | null
) =>
  new Promise<boolean>((resolve) => {
    commitMutation<itinerarySaveUpdateCoverMutation>(environment, {
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
  mutation itinerarySaveUpdateMutation($input: updateItineraryInput!) {
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
  mutation itinerarySaveUpdateCoverMutation($input: updateItineraryInput!) {
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
