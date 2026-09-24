import { saveItineraryUpdateMutation } from "__generated__/saveItineraryUpdateMutation.graphql"
import { itineraryCoverImageKey } from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import { removeLocalImage, storeLocalImage } from "app/utils/LocalImageStore"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { Image as PickedImage } from "react-native-image-crop-picker"
import { commitLocalUpdate, commitMutation, graphql } from "react-relay"
import { IEnvironment } from "relay-runtime"

export type LocalCover = Pick<PickedImage, "path" | "width" | "height">

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
export const saveItinerary = async (
  environment: IEnvironment,
  { id, internalID }: { id: string; internalID: string },
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
      commitMutation<saveItineraryUpdateMutation>(environment, {
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
  mutation saveItineraryUpdateMutation($input: updateItineraryInput!) {
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
