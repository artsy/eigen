import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ThreeUpImageLayout } from "./ThreeUpImageLayout"

describe("ThreeUpImageLayout", () => {
  const mockImageURLs = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ]

  it("renders three images with the provided URLs", () => {
    renderWithWrappers(<ThreeUpImageLayout imageURLs={mockImageURLs} />)

    expect(screen.getByTestId("image-1").props.testID).toBe(mockImageURLs[0])
    expect(screen.getByTestId("image-2").props.src).toBe(mockImageURLs[1])
    expect(screen.getByTestId("image-3").props.src).toBe(mockImageURLs[2])
  })

  it("handles less than 3 images by reusing the last provided image", () => {
    const twoImages = mockImageURLs.slice(0, 2)
    renderWithWrappers(<ThreeUpImageLayout imageURLs={twoImages} />)

    expect(screen.getByTestId("image-1").props.src).toBe(twoImages[0])
    expect(screen.getByTestId("image-2").props.src).toBe(twoImages[1])
    expect(screen.getByTestId("image-3").props.src).toBe(twoImages[1]) // Reuses last image
  })
})
