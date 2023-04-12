import * as Yup from "yup"

export interface PriceDatabaseSearchModel {
  artist: string
  artistId: string
  categories: string[]
  sizes: string[]
}

export const PriceDatabaseSearchInitialValues: PriceDatabaseSearchModel = {
  artist: "",
  artistId: "",
  categories: [],
  sizes: [],
}

export const priceDatabaseValidationSchema = Yup.object().shape({
  artist: Yup.string().trim(),
  artistId: Yup.string().required(
    "Please select an artist from the list. Artists who are not  listed cannot be submitted due to limited demand."
  ),
})
