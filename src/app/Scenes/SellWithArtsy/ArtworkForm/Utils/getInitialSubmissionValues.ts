import {
  ConsignmentAttributionClass,
  SubmitArtworkFormEditQuery$data,
} from "__generated__/SubmitArtworkFormEditQuery.graphql"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { acceptableCategoriesForSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"

export const getInitialSubmissionValues = (
  values: NonNullable<SubmitArtworkFormEditQuery$data["submission"]>
): ArtworkDetailsFormModel => {
  const initialPhotos = values.assets?.map((asset) => asset?.imageUrls) ?? []

  const allVersions = Object.values(initialPhotos).filter(
    (image) => Object.values(image).length >= 1
  )
  const largestImages = allVersions.map((image) => Object.values(image)[0] as string)

  const categories = acceptableCategoriesForSubmission()

  return {
    artist: values.artist?.name ?? "",
    artistId: values.artist?.internalID ?? "",
    category: categories.find((category) => category.label === values.category)?.value as any,
    year: values.year ?? "",
    title: values.title ?? "",
    medium: values.medium ?? "",
    attributionClass:
      (values.attributionClass?.replace("_", " ").toLowerCase() as ConsignmentAttributionClass) ??
      null,
    editionNumber: values.editionNumber ?? "",
    editionSizeFormatted: values.editionSize ?? "",
    height: values.height ?? "",
    // Because we only use `isYearUnknown` for validating the form, we need to set this dependent on the value of `year`
    isYearUnknown: ["", null, undefined].includes(values.year),
    width: values.width ?? "",
    depth: values.depth ?? "",
    dimensionsMetric: values.dimensionsMetric ?? "in",
    provenance: values.provenance ?? "",
    location: {
      city: values.locationCity ?? "",
      country: values.locationCountry ?? "",
      state: values.locationState ?? "",
      countryCode: values.locationCountryCode ?? "",
    },
    signature: values.signature ?? null,
    userEmail: values.userEmail ?? "",
    userName: values.userId ?? "",
    userPhone: values.userPhone ?? "",
    submissionId: values.id,
    artistSearchResult: null,
    source: values.source ?? null,
    myCollectionArtworkID: values.sourceArtworkID ?? null,
    photos: largestImages.map((imageUrl: string) => ({
      path: imageUrl || "",
    })),
  }
}
