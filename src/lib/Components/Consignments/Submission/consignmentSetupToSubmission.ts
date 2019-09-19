import { CreateSubmissionMutationInput } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignmentSubmissionMutation.graphql"
import { isNil, omitBy } from "lodash"
import { ConsignmentSetup } from "../index"

export const consignmentSetupToMutationInput = (submission: ConsignmentSetup) =>
  omitBy(
    {
      // A random string as we're not using Relay
      clientMutationId:
        typeof jest === "undefined"
          ? Math.random()
              .toString(36)
              .slice(2)
          : "ID",
      // Required fields by metaphysics
      artistID: submission.artist ? submission.artist.internalID : "",
      // Required for updating a submission
      id: submission.submissionID,
      // Required for finalizing a submission
      state: submission.state,
      // Optional
      authenticityCertificate: submission.certificateOfAuth,
      category: submission.metadata ? submission.metadata.category : undefined,
      depth: submission.metadata && submission.metadata.depth && submission.metadata.depth.toString(),
      dimensionsMetric: submission.metadata && submission.metadata.unit,
      edition: !!submission.editionInfo,
      editionNumber: submission.editionInfo && submission.editionInfo.number,
      editionSize: submission.editionInfo && parseInt(submission.editionInfo.size, 10),
      height: submission.metadata && submission.metadata.height,
      locationCity: submission.location && submission.location.city,
      locationCountry: submission.location && submission.location.country,
      locationState: submission.location && submission.location.state,
      medium: submission.metadata && submission.metadata.medium,
      provenance: submission.provenance,
      signature: submission.signed,
      title: submission.metadata && submission.metadata.title,
      width: submission.metadata && submission.metadata.width,
      year: submission.metadata && submission.metadata.year,
    },
    isNil
  ) as CreateSubmissionMutationInput & UpdateSubmissionMutationInput
