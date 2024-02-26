import { screen } from "@testing-library/react-native"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

describe("ImageWithLoadingState", () => {
  it("renders the image", async () => {
    // Add 'async' keyword to the test function
    renderWithWrappers(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    const images = screen.getAllByLabelText("Image with Loading State")

    expect(images).toHaveLength(1)
    const image = await images[0].findByType(OpaqueImageView)
    expect(image.props.imageURL).toBe(imageURL)
  })
})
