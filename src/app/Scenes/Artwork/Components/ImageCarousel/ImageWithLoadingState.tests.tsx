import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

describe("ImageWithLoadingState", () => {
  it("renders the image", () => {
    const { getAllByLabelText } = renderWithWrappers(
      <ImageWithLoadingState imageURL={imageURL} {...style} />
    )
    const images = getAllByLabelText("Image with Loading State")

    expect(images).toHaveLength(1)
    expect(images[0].findByType(OpaqueImageView)).toHaveProp("imageURL", imageURL)
  })
})
