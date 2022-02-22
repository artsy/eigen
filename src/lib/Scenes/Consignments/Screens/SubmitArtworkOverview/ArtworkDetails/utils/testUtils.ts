import { ArtworkDetailsFormModel } from "../validation"
import { limitedEditionValue } from "./rarityOptions"

export const mockFormValues: ArtworkDetailsFormModel = {
  artist: "123",
  artistId: "200",
  title: "hello",
  year: "2000",
  medium: "oil",
  attributionClass: limitedEditionValue,
  editionNumber: "1",
  editionSizeFormatted: "1",
  dimensionsMetric: "in",
  height: "2",
  width: "2",
  depth: "2",
  provenance: "found",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
  location: {
    city: "London",
    state: "England",
    country: "UK",
  },
}
