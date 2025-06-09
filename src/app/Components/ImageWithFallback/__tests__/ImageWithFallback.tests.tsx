import { screen } from "@testing-library/react-native"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ImageWithFallback", () => {
  it("renders without error", () => {
    renderWithWrappers(<ImageWithFallback width={100} height={100} />)
  })

  it("renders the image when a url is passed", async () => {
    renderWithWrappers(
      <ImageWithFallback src="https://example.com/image.jpg" width={100} height={100} />
    )
    const image = await screen.findByTestId("image")
    expect(image).toBeTruthy()
  })

  it("renders the fallback when a url is not passed", async () => {
    renderWithWrappers(<ImageWithFallback width={100} height={100} />)

    const fallbackImage = await screen.findByTestId("fallback-image")
    expect(fallbackImage).toBeTruthy()
  })
})
