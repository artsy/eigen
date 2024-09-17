import {
  ConsignmentAttributionClass,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignSubmissionMutation.graphql"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
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
    | (Partial<SubmissionModel> & Partial<SWASubmissionContactInformationFormModel>)
    | (ArtworkDetailsFormModel & SWASubmissionContactInformationFormModel),
  externalID: string | null
) => {
  const isRarityLimitedEdition = values.attributionClass === limitedEditionValue

  const attributionClass = values?.attributionClass
    ?.replace(" ", "_")
    .toUpperCase() as ConsignmentAttributionClass

  const submissionValues: SubmissionInput = {
    artistID: values.artistId,
    attributionClass,
    category: values.category,
    depth: values.depth,
    dimensionsMetric: values.dimensionsMetric,
    editionNumber: isRarityLimitedEdition ? values.editionNumber : undefined,
    editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : undefined,
    height: values.height,
    locationCity: values.location?.city,
    locationCountry: values.location?.country,
    locationCountryCode: values.location?.countryCode,
    locationPostalCode: values.location?.zipCode,
    locationState: values.location?.state,
    locationAddress: values.location?.address,
    locationAddress2: values.location?.address2,
    medium: values.medium,
    provenance: values.provenance,
    signature: values.signature,
    state: values.state,
    title: values.title,
    userEmail: values.userEmail,
    userName: values.userName,
    userPhone: values.userPhone,
    utmMedium: values.utmMedium,
    utmSource: values.utmSource,
    utmTerm: values.utmTerm,
    width: values.width,
    year: values.year,
  }

  if (externalID) {
    return await updateConsignSubmission({
      externalId: externalID,
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
