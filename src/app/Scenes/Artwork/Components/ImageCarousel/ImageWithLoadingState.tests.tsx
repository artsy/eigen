import { Image } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

describe("ImageWithLoadingState", () => {
  it("renders the image", async () => {
    renderWithWrappers(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    const images = screen.getAllByLabelText("Image with Loading State")

    expect(images).toHaveLength(1)
    expect(await images[0].findByType(Image)).toHaveProp("src", imageURL)
  })
})
