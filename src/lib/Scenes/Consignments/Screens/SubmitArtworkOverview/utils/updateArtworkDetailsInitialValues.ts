import { ArtworkDetails_submission } from "__generated__/ArtworkDetails_submission.graphql"
import { ArtworkDetailsFormModel } from "../ArtworkDetails/ArtworkDetailsForm"

export const updateArtworkDetailsInitialValues = (submission: ArtworkDetails_submission): ArtworkDetailsFormModel => {
  const updatedForm = {
    artist: submission.artist?.name || "",
    artistId: submission.artist?.internalID || "",
    title: submission.title || "",
    year: submission.year || "",
    medium: submission.medium || "",
    attributionClass: submission.attributionClass ? submission.attributionClass.replace(" ", "_").toUpperCase() : "",
    editionNumber: submission.editionNumber || "",
    editionSizeFormatted: submission.editionSize || "",
    dimensionsMetric: submission.dimensionsMetric || "",
    height: submission.height || "",
    width: submission.width || "",
    depth: submission.depth || "",
    provenance: submission.provenance || "",
    state: "DRAFT",
    utmMedium: submission.utmMedium || "",
    utmSource: submission.utmSource || "",
    utmTerm: submission.utmTerm || "",
    location: {
      city: submission.locationCity || "",
      state: submission.locationState || "",
      country: submission.locationCountry || "",
    },
  }
  return updatedForm
}
