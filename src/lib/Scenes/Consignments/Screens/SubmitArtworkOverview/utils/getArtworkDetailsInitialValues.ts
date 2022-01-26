import { ArtworkDetailsFormModel } from "../ArtworkDetails/ArtworkDetailsForm"
import { SubmissionForm } from "../State/SubmissionModel"
import { artworkDetailsEmptyInitialValues } from "./validation"

export const getArtworkDetailsInitialValues = (
  submission: SubmissionForm | null
): ArtworkDetailsFormModel => {
  if (!submission) {
    return artworkDetailsEmptyInitialValues
  }

  const updatedForm = {
    artist: submission.artistName || "",
    artistId: submission.artistID || "",
    title: submission.title || "",
    year: submission.year || "",
    medium: submission.medium || "",
    attributionClass: submission.attributionClass
      ? submission.attributionClass.replace("_", " ").toLowerCase()
      : "",
    editionNumber: submission.editionNumber || "",
    editionSizeFormatted: submission.editionSizeFormatted || "",
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
