import { render } from "@testing-library/react-native"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

describe("ImageWithLoadingState", () => {
  it("renders the image", () => {
    const { getAllByLabelText } = render(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    const images = getAllByLabelText("Image with Loading State")

    expect(images).toHaveLength(1)
    expect(images[0].findByType(OpaqueImageView)).toHaveProp("imageURL", imageURL)
  })
})
