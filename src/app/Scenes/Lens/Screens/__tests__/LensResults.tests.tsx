import FastImage from "@d11/react-native-fast-image"
import { fireEvent, screen, within } from "@testing-library/react-native"
import { LensResultsTestsQuery } from "__generated__/LensResultsTestsQuery.graphql"
import { LensResultsScreen } from "app/Scenes/Lens/Screens/LensResults"
import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { goBack, navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { BackHandler } from "react-native"
import { graphql } from "react-relay"

jest.mock("app/Scenes/Lens/utils/discardTempPhotos", () => ({
  discardTempPhotos: jest.fn(),
}))

const mockNavigate = jest.fn()
const photoUri = "file:///tmp/cropped.jpg"

describe("LensResults", () => {
  const { renderWithRelay } = setupTestWrapper<LensResultsTestsQuery>({
    Component: () => (
      <LensResultsScreen
        route={
          {
            key: "LensResults",
            name: "LensResults",
            params: { s3Bucket: "my-bucket", s3Key: "my-key", photoUri },
          } as any
        }
        navigation={{ navigate: mockNavigate } as any}
      />
    ),
    query: graphql`
      query LensResultsTestsQuery($s3Bucket: String!, $s3Key: String!) @relay_test_operation {
        ...LensResults_artworks @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key)
      }
    `,
    variables: { s3Bucket: "my-bucket", s3Key: "my-key" },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("uses the artwork's standard link when a result is pressed", () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Cool Painting",
        slug: "some-artwork-slug",
        href: "/artwork/some-artwork-slug",
      }),
    })

    fireEvent.press(screen.getByTestId("artworkGridItem-Cool Painting"))

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/artwork/some-artwork-slug")
  })

  it("returns to the previous screen when backing out", () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    fireEvent.press(screen.getByLabelText("Back"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("returns to the previous screen on Android hardware back too", () => {
    const addEventListener = jest.spyOn(BackHandler, "addEventListener")

    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    const handler = addEventListener.mock.calls
      .filter(([event]) => event === "hardwareBackPress")
      .at(-1)?.[1]

    // `true`, or the stack's own handler runs next and pops.
    expect(handler?.()).toBe(true)

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("offers a way to search another photo when there are no matches", () => {
    renderWithRelay({ ArtworkConnection: () => ({ edges: [] }) })

    expect(screen.getByText("No matches found. Please try another photo.")).toBeOnTheScreen()
    expect(screen.getByText("Try another photo")).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("lensResultsSearchByPhotoButton"))

    expect(mockNavigate).toHaveBeenCalledWith("LensCamera")
  })

  it("does not offer that button when there are matches to tap", () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(screen.queryByTestId("lensResultsSearchByPhotoButton")).toBeNull()
  })

  it("shows the photo the search ran on", () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    const thumbnail = within(screen.getByTestId("lensResultsPhotoThumbnail")).UNSAFE_getByType(
      FastImage
    )

    expect(thumbnail.props.source.uri).toBe(photoUri)
  })

  it("tells the user these are matches to their photo", () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(screen.getByText("Great taste! Here are some matches to your photo")).toBeTruthy()
  })

  it("claims no matches when there are none", () => {
    renderWithRelay({ ArtworkConnection: () => ({ edges: [] }) })

    expect(
      screen.getByText("Unfortunately, we couldn't find great matches for that photo")
    ).toBeOnTheScreen()
    expect(screen.queryByText("Great taste! Here are some matches to your photo")).toBeNull()
  })

  it("deletes the searched photo on the way out", () => {
    const { unmount } = renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(discardTempPhotos).not.toHaveBeenCalled()

    unmount()

    expect(discardTempPhotos).toHaveBeenCalledWith([photoUri])
  })
})
