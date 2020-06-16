import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/artworkModel"

export function formValidation(values: ArtworkFormValues) {
  const errors: any = {}

  if (values.artist?.toLowerCase() !== "pablo picasso") {
    errors.artist = "Artist must be pablo picasso"
  }

  return errors
}
