import { screen } from "@testing-library/react-native"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ThreeUpImageLayout", () => {
  const mockImageURLs = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ]

  it("renders three images", () => {
    renderWithWrappers(<ThreeUpImageLayout imageURLs={mockImageURLs} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.getByTestId("image-2")).toBeDefined()
    expect(screen.getByTestId("image-3")).toBeDefined()
  })

  it("handles less than 3 images by reusing the last provided image", () => {
    const twoImages = mockImageURLs.slice(0, 2)
    renderWithWrappers(<ThreeUpImageLayout imageURLs={twoImages} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.getByTestId("image-2")).toBeDefined()
    expect(screen.getByTestId("image-3")).toBeDefined()
  })
})
