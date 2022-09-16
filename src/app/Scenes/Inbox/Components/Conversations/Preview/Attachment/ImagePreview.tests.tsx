import { screen } from "@testing-library/react-native"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { ImagePreview } from "./ImagePreview"

it("renders without throwing an error", () => {
  renderWithRelayWrappers(<ImagePreview attachment={attachment as any} />)

  expect(screen.UNSAFE_getByType(OpaqueImageView)).toBeTruthy()
  expect(screen.UNSAFE_getByType(OpaqueImageView)).toHaveProp("imageURL", "/path/to/cats.jpg")
})

const attachment = {
  id: "cats",
  downloadURL: "/path/to/cats.jpg",
}
