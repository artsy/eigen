import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { limitedEditionValue } from "./rarityOptions"

export const mockFormValues: ArtworkDetailsFormModel = {
  artist: "Caspar David Friedrich",
  artistId: "200",
  attributionClass: limitedEditionValue,
  category: "PAINTING",
  depth: "2",
  dimensionsMetric: "in",
  editionNumber: "1",
  editionSizeFormatted: "1",
  height: "2",
  location: {
    city: "London",
    state: "England",
    country: "UK",
    countryCode: "UK",
    zipCode: "71202",
  },
  medium: "oil on canvas",
  myCollectionArtworkID: null,
  provenance: "found",
  source: null,
  state: "DRAFT",
  title: "hello",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
  width: "2",
  year: "2000",
}
