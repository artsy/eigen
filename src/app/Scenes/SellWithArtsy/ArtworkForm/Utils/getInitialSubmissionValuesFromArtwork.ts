import { ConsignmentAttributionClass } from "__generated__/createConsignSubmissionMutation.graphql"
import { ArtworkConditionEnumType } from "__generated__/myCollectionCreateArtworkMutation.graphql"
import { FetchArtworkInformationResult } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { acceptableCategoriesForSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { getAttributionClassValueByName } from "app/utils/artworkRarityClassifications"
import { compact } from "lodash"

/**
 * Helper method used to get the initial form values for the submission form
 * from the artwork information
 */
export const getInitialSubmissionFormValuesFromArtwork = (
  artwork: NonNullable<FetchArtworkInformationResult>
) => {
  // By setting the path for each image we make sure the image will be uploaded to S3
  // and processed by Gemini.
  const initialPhotos =
    compact(
      artwork.images?.map((image) => {
        const imageURL = image?.imageURL
        if (!imageURL) {
          return null
        }

        return {
          height: image?.height || undefined,
          isDefault: image?.isDefault || undefined,
          imageURL: imageURL,
          path: imageURL.replace(":version", "large"),
          width: image?.width || undefined,
          automaticallyAdded: true,
        }
      })
    ) || []

  // Although ideally we would set the type as a partial here,
  // that will make us quickly forget to update the type when we add new fields/screens
  // This is a tradeoff between type safety and ease of development
  const formValues: SubmissionModel = {
    submissionId: null,
    artist: artwork.artist?.displayLabel || "",
    artistId: artwork.artist?.internalID || "",
    artistSearchResult: {
      imageUrl: artwork.artist?.imageUrl || "",
      href: artwork.artist?.href || "",
      internalID: artwork.artist?.internalID || "",
      displayLabel: artwork.artist?.displayLabel || "",
      __typename: "Artist",
    },
    attributionClass:
      (getAttributionClassValueByName(
        artwork.attributionClass?.name
      ) as ConsignmentAttributionClass) || undefined,
    category: acceptableCategoriesForSubmission().find(
      (category) => category.label === artwork.category
    )?.value as any,
    depth: artwork.depth || "",
    dimensionsMetric: artwork.metric || "",
    editionNumber: artwork.editionNumber || "",
    editionSizeFormatted: artwork.editionSize || "",
    height: artwork.height || "",
    location: {
      city: artwork?.location?.city || "",
      state: artwork?.location?.state || "",
      country: artwork?.location?.country || "",
      zipCode: artwork?.location?.postalCode || "",
      countryCode: "",
      address: artwork?.location?.address || "",
      address2: artwork?.location?.address2 || "",
    },
    medium: artwork.medium || "",
    myCollectionArtworkID: artwork.internalID,
    provenance: artwork.provenance || "",
    // If there is a signature, set it to true, otherwise null
    // This is because the signature field is a boolean
    // Anyway, the user can change it later during the flow
    signature: artwork.signature ? true : null,
    source: "MY_COLLECTION",
    state: "DRAFT",
    utmMedium: "",
    utmSource: "",
    utmTerm: "",
    width: artwork.width || "",
    title: artwork.title || "",
    year: artwork.date || "",

    // Photos
    photos: [],
    initialPhotos,

    // Contact information
    userName: "",
    userEmail: "",
    userPhone: "",

    artwork: {
      internalID: artwork.internalID,
      isFramed: artwork.isFramed,
      framedMetric: artwork.framedMetric,
      framedWidth: artwork.framedWidth,
      framedHeight: artwork.framedHeight,
      framedDepth: artwork.framedDepth,
      condition: artwork.condition?.value as ArtworkConditionEnumType | null | undefined,
      conditionDescription: artwork.conditionDescription?.details,
    },
  }

  return formValues
}
