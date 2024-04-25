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
  values: ArtworkDetailsFormModel & SWASubmissionContactInformationFormModel,
  submissionId: string
) => {
  const isRarityLimitedEdition = values.attributionClass === limitedEditionValue
  type NewType = ConsignmentAttributionClass

  const attributionClass =
    (values?.attributionClass?.replace(" ", "_").toUpperCase() as NewType) || null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { artist, artistId, location, myCollectionArtworkID, source, ...restValues } = values

  const submissionValues: SubmissionInput = {
    ...restValues,
    artistID: artistId,
    attributionClass,
    editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
    editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
    locationCity: location?.city,
    locationState: location?.state,
    locationCountry: location?.country,
    locationCountryCode: location?.countryCode,
    locationPostalCode: location?.zipCode || null,
    state: values.state || "DRAFT",
  }

  if (submissionId) {
    return await updateConsignSubmission({
      id: submissionId,
      ...submissionValues,
    } as UpdateSubmissionMutationInput)
  }

  return await createConsignSubmission({
    myCollectionArtworkID,
    source: source || DEFAULT_SOURCE,
    ...submissionValues,
  } as CreateSubmissionMutationInput)
}
