import { ConsignmentSetup } from "../index"
import { objectToGraphQLInput } from "./objectToGraphQL"

export const consignmentSetupToMutationInput = (submission: ConsignmentSetup): string =>
  objectToGraphQLInput(
    {
      // A random string as we're not using Relay
      clientMutationId: typeof jest === "undefined" ? Math.random().toString(36).slice(2) : "ID",
      // Required fields by metaphysics
      artist_id: submission.artist && submission.artist.id,
      // Required for updating a submission
      id: submission.submission_id,
      // Optional
      authenticity_certificate: submission.certificateOfAuth,
      category: submission.metadata && submission.metadata.category,
      depth: submission.metadata && submission.metadata.depth,
      dimensions_metric: submission.metadata && submission.metadata.unit,
      edition: submission.editionInfo && submission.editionInfo.displayString,
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
    ["category", "dimensions_metric"] // Enums
  )
