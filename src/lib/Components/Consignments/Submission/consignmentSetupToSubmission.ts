import { CreateSubmissionMutationInput } from "__generated__/CreateConsignmentSubmissionMutation.graphql"
import { isNil, omitBy } from "lodash"
import { ConsignmentSetup } from "../index"
import { objectToGraphQLInput } from "./objectToGraphQL"

// TODO: Still needed?
export const consignmentSetupToMutationInputString = (submission: ConsignmentSetup): string =>
  objectToGraphQLInput(
    {
      // A random string as we're not using Relay
      clientMutationId:
        typeof jest === "undefined"
          ? Math.random()
              .toString(36)
              .slice(2)
          : "ID",
      // Required fields by metaphysics
      artist_id: submission.artist && submission.artist.internalID,
      // Required for updating a submission
      id: submission.submission_id,
      // Required for finalizing a submission
      state: submission.state,
      // Optional
      authenticity_certificate: submission.certificateOfAuth,
      category: submission.metadata && submission.metadata.category,
      depth: submission.metadata && submission.metadata.depth,
      dimensions_metric: submission.metadata && submission.metadata.unit,
      edition: !!submission.editionInfo,
      edition_number: submission.editionInfo && submission.editionInfo.number,
      edition_size: submission.editionInfo && submission.editionInfo.size,
      height: submission.metadata && submission.metadata.height,
      location_city: submission.location && submission.location.city,
      location_country: submission.location && submission.location.country,
      location_state: submission.location && submission.location.state,
      medium: submission.metadata && submission.metadata.medium,
      provenance: submission.provenance,
      signature: submission.signed,
      title: submission.metadata && submission.metadata.title,
      width: submission.metadata && submission.metadata.width,
      year: submission.metadata && submission.metadata.year,
    },
    ["category", "dimensions_metric", "state"] // Enums
  )

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
      internalID: submission.submission_id,
      // Required for finalizing a submission
      state: submission.state,
      // Optional
      authenticityCertificate: submission.certificateOfAuth,
      category: submission.metadata ? submission.metadata.category : undefined,
      depth: submission.metadata && submission.metadata.depth && submission.metadata.depth.toString(),
      dimensions_metric: submission.metadata && submission.metadata.unit,
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
  ) as CreateSubmissionMutationInput
