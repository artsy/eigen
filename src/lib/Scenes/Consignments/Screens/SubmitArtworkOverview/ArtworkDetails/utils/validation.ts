import * as yup from "yup"

export const artworkDetailsInitialValues = {
  artist: "",
  artistId: "",
  title: "",
  year: "",
  materials: "",
  rarity: "",
  height: "",
  width: "",
  depth: "",
  provenance: "",
  location: "",
}

export const artworkDetailsValidationSchema = yup.object().shape({
  artist: yup.string().required().trim(),
  artistId: yup.string().required().trim(),
  title: yup.string().required().trim(),
  year: yup.string().required().trim(),
  materials: yup.string().required().trim(),
  rarity: yup.string().required(),
  height: yup.string().required().trim(),
  width: yup.string().required().trim(),
  depth: yup.string().required().trim(),
  provenance: yup.string().required().trim(),
  location: yup.string().required(),
})
