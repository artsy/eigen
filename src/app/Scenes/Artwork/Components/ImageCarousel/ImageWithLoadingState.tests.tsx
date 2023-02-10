import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import OpaqueImageView2 from "palette/elements/OpaqueImageView/OpaqueImageView2"
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
    expect(images[0].findByType(OpaqueImageView2)).toHaveProp("imageURL", imageURL)
  })
})
