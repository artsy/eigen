import {
  ConsignmentAttributionClass,
  SubmitArtworkFormEditQuery$data,
} from "__generated__/SubmitArtworkFormEditQuery.graphql"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { acceptableCategoriesForSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { compact } from "lodash"

export const getInitialSubmissionValues = (
  values: NonNullable<SubmitArtworkFormEditQuery$data["submission"]>
): ArtworkDetailsFormModel => {
  const photos =
    values.assets?.map((asset) => {
      const path = (Object.values(asset?.imageUrls || {})?.[0] as string) ?? ""

      return {
        path,
        id: asset?.id ?? "",
        geminiToken: asset?.geminiToken ?? "",
      }
    }) ?? []

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
    state: values.state ?? null,
    myCollectionArtworkID: values.sourceArtworkID ?? null,
    photos: compact(photos),
  }
}
