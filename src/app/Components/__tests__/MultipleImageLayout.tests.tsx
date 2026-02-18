import { screen } from "@testing-library/react-native"
import { MultipleImageLayout } from "app/Components/MultipleImageLayout"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MultipleImageLayout", () => {
  const mockImageURLs = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ]

  it("renders three images", () => {
    renderWithWrappers(<MultipleImageLayout imageURLs={mockImageURLs} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.getByTestId("image-2")).toBeDefined()
    expect(screen.getByTestId("image-3")).toBeDefined()
  })

  it("handles 2 out of 3 images by changing the layout", () => {
    const twoImages = mockImageURLs.slice(0, 2)
    renderWithWrappers(<MultipleImageLayout imageURLs={twoImages} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.getByTestId("image-2")).toBeDefined()
    expect(screen.queryAllByTestId("image-3")).toHaveLength(0)
  })

  it("handles 1 out of 3 images by changing the layout", () => {
    const oneImage = mockImageURLs.slice(0, 1)
    renderWithWrappers(<MultipleImageLayout imageURLs={oneImage} />)

    expect(screen.getByTestId("image-1")).toBeDefined()
    expect(screen.queryAllByTestId("image-2")).toHaveLength(0)
    expect(screen.queryAllByTestId("image-3")).toHaveLength(0)
  })
})
