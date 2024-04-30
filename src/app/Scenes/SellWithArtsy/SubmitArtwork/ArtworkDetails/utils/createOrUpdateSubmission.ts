import {
  ConsignmentAttributionClass,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignSubmissionMutation.graphql"
import {
  ArtworkDetailsFormModel,
  ContactInformationFormModel as SWASubmissionContactInformationFormModel,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import {
  createConsignSubmission,
  updateConsignSubmission,
} from "app/Scenes/SellWithArtsy/mutations"
import { limitedEditionValue } from "./rarityOptions"

export type SubmissionInput = CreateSubmissionMutationInput | UpdateSubmissionMutationInput

const DEFAULT_SOURCE = "APP_INBOUND"

export const createOrUpdateSubmission = async (
  values:
    | ArtworkDetailsFormModel
    | (ArtworkDetailsFormModel & SWASubmissionContactInformationFormModel),
  submissionId: string
) => {
  const isRarityLimitedEdition = values.attributionClass === limitedEditionValue
  type NewType = ConsignmentAttributionClass

  const attributionClass =
    (values?.attributionClass?.replace(" ", "_").toUpperCase() as NewType) || null

  const submissionValues: SubmissionInput = {
    category: values.category,
    medium: values.medium,
    artistID: values.artistId,
    attributionClass,
    editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
    editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
    locationCity: values.location?.city,
    locationState: values.location?.state,
    locationCountry: values.location?.country,
    locationCountryCode: values.location?.countryCode,
    locationPostalCode: values.location?.zipCode || null,
    state: values.state || "DRAFT",
    utmMedium: values.utmMedium,
    utmSource: values.utmSource,
    utmTerm: values.utmTerm,
    depth: values.depth,
    height: values.height,
    width: values.width,
    dimensionsMetric: values.dimensionsMetric,
    // userEmail: values.userEmail,
    // userName: values.userName,
    // userPhone: values.userPhone,
    year: values.year,
    provenance: values.provenance,
    title: values.title,
  }

  if (submissionId) {
    return await updateConsignSubmission({
      id: submissionId,
      ...submissionValues,
    })
  }

  // ArtistID is required for creating a submission
  if (values.artistId) {
    return await createConsignSubmission({
      myCollectionArtworkID: values.myCollectionArtworkID,
      source: values.source || DEFAULT_SOURCE,
      ...submissionValues,
      artistID: values.artistId,
    })
  }
}
