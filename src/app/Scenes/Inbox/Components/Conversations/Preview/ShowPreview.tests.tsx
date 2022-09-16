import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import ShowPreview from "./ShowPreview"

it("renders without throwing an error", () => {
  renderWithRelayWrappers(<ShowPreview show={show as any} />)

  expect(screen.queryByText("Catty Show")).toBeTruthy()
  expect(screen.queryByText("Catty Partner")).toBeTruthy()
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
