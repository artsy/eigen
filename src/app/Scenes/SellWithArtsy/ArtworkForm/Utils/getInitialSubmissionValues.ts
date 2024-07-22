import {
  ConsignmentAttributionClass,
  SubmitArtworkFormEditQuery$data,
} from "__generated__/SubmitArtworkFormEditQuery.graphql"
import { COUNTRY_SELECT_OPTIONS } from "app/Components/CountrySelect"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { acceptableCategoriesForSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"

export const getInitialSubmissionValues = (
  values: NonNullable<SubmitArtworkFormEditQuery$data["submission"]>,
  me: SubmitArtworkFormEditQuery$data["me"]
): SubmissionModel => {
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

  const addresses = extractNodes(me?.addressConnection)
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses?.[0]

  console.log("====")
  console.log(values.myCollectionArtwork)

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
      city: values.locationCity ?? defaultAddress?.city ?? "",
      country: values.locationCountry ?? defaultAddress?.country ?? "",
      state: values.locationState ?? defaultAddress?.region ?? "",
      countryCode:
        values.locationCountryCode ??
        COUNTRY_SELECT_OPTIONS.find(({ label }) => label === defaultAddress?.country)?.value ??
        "",
      zipCode: values.locationPostalCode ?? defaultAddress?.postalCode ?? "",
      address: values.locationAddress ?? defaultAddress?.addressLine1 ?? "",
      address2: values.locationAddress2 ?? defaultAddress?.addressLine2 ?? "",
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
    artwork: {
      internalID: values.myCollectionArtwork?.internalID ?? null,
      isFramed: values.myCollectionArtwork?.isFramed ?? null,
      framedMetric: values.myCollectionArtwork?.framedMetric ?? null,
      framedWidth: values.myCollectionArtwork?.framedWidth ?? null,
      framedHeight: values.myCollectionArtwork?.framedHeight ?? null,
      framedDepth: values.myCollectionArtwork?.framedDepth ?? null,
    },
  }
}
