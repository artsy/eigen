import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import "react-native"

import ShowPreview from "./ShowPreview"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<ShowPreview show={show as any} />)
})

const show = {
  name: "Catty Show",
  id: "slugID",
  internalID: "mongoID",
  coverImage: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
    aspectRatio: 1,
  },
  partner: {
    name: "Catty Partner",
  },
  fair: null,
}
