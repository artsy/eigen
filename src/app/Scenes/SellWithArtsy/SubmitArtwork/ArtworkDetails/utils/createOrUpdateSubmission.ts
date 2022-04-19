import {
  ConsignmentAttributionClass,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignSubmissionMutation.graphql"
import { createConsignSubmission, updateConsignSubmission } from "../../../mutations"
import { ArtworkDetailsFormModel } from "../validation"
import { limitedEditionValue } from "./rarityOptions"

export type SubmissionInput = CreateSubmissionMutationInput | UpdateSubmissionMutationInput

const DEFAULT_SOURCE = "APP_INBOUND"

export const createOrUpdateSubmission = async (
  values: ArtworkDetailsFormModel,
  submissionId: string
) => {
  const isRarityLimitedEdition = values.attributionClass === limitedEditionValue
  type NewType = ConsignmentAttributionClass

  const attributionClass =
    (values?.attributionClass?.replace(" ", "_").toUpperCase() as NewType) || null

  const submissionValues: SubmissionInput = {
    artistID: values.artistId,
    year: values.year,
    title: values.title,
    medium: values.medium,
    attributionClass,
    editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
    editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
    height: values.height,
    width: values.width,
    depth: values.depth,
    dimensionsMetric: values.dimensionsMetric,
    provenance: values.provenance,
    locationCity: values.location.city,
    locationState: values.location.state,
    locationCountry: values.location.country,
    locationCountryCode: values.location.countryCode,
    locationPostalCode: values.location.zipCode || null,
    state: "DRAFT",
    utmMedium: values.utmMedium,
    utmSource: values.utmSource,
    utmTerm: values.utmTerm,
  }

  if (submissionId) {
    return await updateConsignSubmission({
      id: submissionId,
      ...submissionValues,
    } as UpdateSubmissionMutationInput)
  }

  return await createConsignSubmission({
    myCollectionArtworkID: values.myCollectionArtworkID,
    source: values.source || DEFAULT_SOURCE,
    ...submissionValues,
  } as CreateSubmissionMutationInput)
}
