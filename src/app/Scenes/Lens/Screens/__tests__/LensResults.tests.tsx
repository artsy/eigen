import { fireEvent, screen } from "@testing-library/react-native"
import { LensResultsTestsQuery } from "__generated__/LensResultsTestsQuery.graphql"
import { LensResultsScreen } from "app/Scenes/Lens/Screens/LensResults"
import { goBack, navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { BackHandler } from "react-native"
import { graphql } from "react-relay"

const mockNavigate = jest.fn()

describe("LensResults", () => {
  const { renderWithRelay } = setupTestWrapper<LensResultsTestsQuery>({
    Component: () => (
      <LensResultsScreen
        route={
          {
            key: "LensResults",
            name: "LensResults",
            params: { s3Bucket: "my-bucket", s3Key: "my-key" },
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

  afterEach(() => {
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

    fireEvent.press(screen.getByTestId("lensResultsSearchByPhotoButton"))

    expect(mockNavigate).toHaveBeenCalledWith("LensCamera")
  })

  it("does not offer that button when there are matches to tap", () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(screen.queryByTestId("lensResultsSearchByPhotoButton")).toBeNull()
  })
})
