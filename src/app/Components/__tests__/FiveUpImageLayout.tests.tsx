import { screen } from "@testing-library/react-native"
import { FiveUpImageLayout } from "app/Components/FiveUpImageLayout"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Image } from "react-native"

describe("FiveUpImageLayout", () => {
  const mockImageURLs = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
    "https://example.com/image4.jpg",
    "https://example.com/image5.jpg",
  ]

  it("renders five images with the provided URLs", () => {
    renderWithWrappers(<FiveUpImageLayout imageURLs={mockImageURLs} />)

    // Verify all 5 images are rendered
    const images = screen.UNSAFE_getAllByType(Image)
    expect(images).toHaveLength(5)

    // Check that each image has the correct source URL
    images.forEach((image, index) => {
      expect(image.props.source.uri).toBe(mockImageURLs[index])
    })
  })

  it("handles less than 5 images by reusing images", () => {
    const threeImages = mockImageURLs.slice(0, 3)
    renderWithWrappers(<FiveUpImageLayout imageURLs={threeImages} />)

    const images = screen.UNSAFE_getAllByType(Image)
    expect(images).toHaveLength(5)

    // First 3 images should match the provided URLs
    expect(images[0].props.source.uri).toBe(threeImages[0])
    expect(images[1].props.source.uri).toBe(threeImages[1])
    expect(images[2].props.source.uri).toBe(threeImages[2])

    // The 4th and 5th images should cycle back to the first images
    expect(images[3].props.source.uri).toBe(threeImages[0])
    expect(images[4].props.source.uri).toBe(threeImages[1])
  })
})
