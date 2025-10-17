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

  it("handles 2 out of 3 images by chanign the layout", () => {
    const twoImages = mockImageURLs.slice(0, 2)
    renderWithWrappers(<ThreeUpImageLayout imageURLs={twoImages} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.getByTestId("image-2")).toBeDefined()
    expect(screen.queryAllByTestId("image-3")).toHaveLength(0)
  })

  it("handles 1 out of 3 images by chanign the layout", () => {
    const oneImage = mockImageURLs.slice(0, 1)
    renderWithWrappers(<ThreeUpImageLayout imageURLs={oneImage} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.queryAllByTestId("image-2")).toHaveLength(0)
    expect(screen.queryAllByTestId("image-3")).toHaveLength(0)
  })
})
