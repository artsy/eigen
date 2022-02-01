import { CreateSubmissionMutationInput } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignSubmissionMutation.graphql"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { ArtworkDetailsFormModel, ContactInformationFormModel } from "./validation"

type SubmissionInput = CreateSubmissionMutationInput | UpdateSubmissionMutationInput
type AllInformationFormModel = ArtworkDetailsFormModel | ContactInformationFormModel

const artistInputValues = (
  values: ArtworkDetailsFormModel
): Pick<SubmissionInput, "artistID" | "editionNumber" | "editionSizeFormatted" | "state"> => {
  const isRarityLimitedEdition = values.attributionClass === "LIMITED_EDITION"

  return {
    artistID: values.artistId,
    editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
    editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
    state: "DRAFT",
  }
}

export const createOrUpdateSubmission = async (
  values: ArtworkDetailsFormModel,
  submissionId: string
) => {
  let submissionValues: Omit<SubmissionInput, "id">

  submissionValues = {
    ...values,
    ...artistInputValues(values),
  }

  if (submissionId) {
    return await updateConsignSubmission({
      id: submissionId,
      ...submissionValues,
    })
  }
  return await createConsignSubmission(submissionValues as CreateSubmissionMutationInput)
}

export const updateSubmission = async (values: AllInformationFormModel, submissionId: string) => {
  let submissionValues: Omit<SubmissionInput, "id">

  if ("artistId" in values) {
    submissionValues = {
      ...values,
      ...artistInputValues(values),
    }
  } else if ("userName" in values) {
    submissionValues = values
  } else if ("photo" in values) {
    submissionValues = values
  } else {
    assertNever(values)
    submissionValues = {}
  }

  return await updateConsignSubmission({
    id: submissionId,
    ...submissionValues,
  })
}
