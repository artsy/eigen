import * as Yup from "yup"

export interface PriceDatabaseFormModel {
  artist: string
  artistId: string
  categories: string[]
}

export const priceDatabaseFormInitialValues: PriceDatabaseFormModel = {
  artist: "",
  artistId: "",
  categories: [],
}

export const priceDatabaseValidationSchema = Yup.object().shape({
  artist: Yup.string().trim(),
  artistId: Yup.string().required(
    "Please select an artist from the list. Artists who are not  listed cannot be submitted due to limited demand."
  ),
})
