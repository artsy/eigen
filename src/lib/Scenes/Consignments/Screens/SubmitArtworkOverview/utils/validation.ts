import * as Yup from "yup"

export const artworkDetailsEmptyInitialValues = {
  artist: "",
  artistId: "",
  title: "",
  year: "",
  medium: "",
  attributionClass: "",
  editionNumber: "",
  editionSizeFormatted: "",
  dimensionsMetric: "in",
  height: "",
  width: "",
  depth: "",
  provenance: "",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
  location: {
    city: "",
    state: "",
    country: "",
  },
}

export const artworkDetailsValidationSchema = Yup.object().shape({
  artist: Yup.string().trim(),
  artistId: Yup.string().required(
    "Please select an artist from the list. Artists who are not  listed cannot be submitted due to limited demand."
  ),
  title: Yup.string().required().trim(),
  year: Yup.string().required().trim(),
  medium: Yup.string().required().trim(),
  attributionClass: Yup.string().required(),
  editionNumber: Yup.string().when("attributionClass", {
    is: "limited edition",
    then: Yup.string().required().trim(),
  }),
  editionSizeFormatted: Yup.string().when("attributionClass", {
    is: "limited edition",
    then: Yup.string().required().trim(),
  }),
  dimensionsMetric: Yup.string().required(),
  height: Yup.string().required().trim(),
  width: Yup.string().required().trim(),
  depth: Yup.string().trim(),
  provenance: Yup.string().required().trim(),
  state: Yup.string(),
  utmMedium: Yup.string(),
  utmSource: Yup.string(),
  utmTerm: Yup.string(),
  location: Yup.object().shape({
    city: Yup.string().required().trim(),
    state: Yup.string(),
    country: Yup.string(),
  }),
})
