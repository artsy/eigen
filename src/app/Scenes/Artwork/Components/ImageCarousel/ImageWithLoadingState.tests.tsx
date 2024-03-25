import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Image } from "react-native"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile Image component
// Until it gets fixed
// See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("ImageWithLoadingState", () => {
  it("renders the image", async () => {
    renderWithWrappers(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    const images = screen.getAllByLabelText("Image with Loading State")

    expect(images).toHaveLength(1)
    expect(await images[0].findByType(Image)).toHaveProp("src", imageURL)
  })
})
