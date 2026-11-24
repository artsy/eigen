import { screen } from "@testing-library/react-native"
import { ImageWithLoadingState } from "app/Scenes/Artwork/Components/ImageCarousel/ImageWithLoadingState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

// palette-mobile's Image puts `testID` on a wrapping Flex and `src`/`style` on an inner
// FastImage. Swap in RN's Image so the testID, `src` and `style` live on one element.
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("ImageWithLoadingState", () => {
  it("renders the image", async () => {
    await renderWithWrappers(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    const images = screen.getAllByLabelText("Image with Loading State")

    expect(images).toHaveLength(1)

    expect(screen.getByTestId("ImageWithLoadingState")).toHaveProp("src", imageURL)
  })
})
