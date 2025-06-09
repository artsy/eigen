import { screen } from "@testing-library/react-native"
import {
  MyCollectionImageView,
  MyCollectionImageViewProps,
} from "app/Scenes/MyCollection/Components/MyCollectionImageView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionImageView", () => {
  it("shows a remote image if imageURL is present", () => {
    const props: MyCollectionImageViewProps = {
      imageWidth: 100,
      imageHeight: 100,
      aspectRatio: 1,
      imageURL: "https://some-url/:version.jpg",
      artworkSlug: "some-slug",
    }
    renderWithWrappers(<MyCollectionImageView {...props} />)

    expect(screen.queryByTestId("Image-Remote")).toBeOnTheScreen()
  })

  it("shows a fallback state if neither are present", () => {
    const props: MyCollectionImageViewProps = {
      imageWidth: 100,
      imageHeight: 100,
      aspectRatio: 1,
      artworkSlug: "some-slug",
    }

    renderWithWrappers(<MyCollectionImageView {...props} />)

    expect(screen.queryByTestId("Fallback")).toBeDefined()
  })
})
