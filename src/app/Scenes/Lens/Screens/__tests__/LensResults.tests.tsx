import { fireEvent, screen } from "@testing-library/react-native"
import { LensResultsTestsQuery } from "__generated__/LensResultsTestsQuery.graphql"
import { LensResultsScreen } from "app/Scenes/Lens/Screens/LensResults"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockReplace = jest.fn()
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
        navigation={{ replace: mockReplace, navigate: mockNavigate } as any}
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

  // Regression coverage for "PUSH ... was not handled by any navigator": `Artwork` lives inside a
  // tab's stack, and Lens is a modal sibling of the tab navigator, so the modal must close first.
  it("dismisses the Lens modal, then navigates to the artwork by internalID (not slug)", () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Cool Painting",
        slug: "some-artwork-slug",
        internalID: "abc123",
      }),
    })

    fireEvent.press(screen.getByTestId("artworkGridItem-Cool Painting"))

    // Without `disableNavigation`, RouterLink's own navigation fires synchronously with the
    // slug-based href, before dismissModal's callback runs.
    expect(navigate).not.toHaveBeenCalledWith(expect.stringContaining("some-artwork-slug"))

    expect(dismissModal).toHaveBeenCalledTimes(1)
    const afterDismiss = jest.mocked(dismissModal).mock.calls[0][0]
    afterDismiss?.()

    expect(navigate).toHaveBeenCalledWith("/artwork/abc123")
  })

  // A local goBack would pop onto the live camera left below by LensAnalyzing's replace.
  it("leaves the Lens flow for the Search tab when backing out", () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    fireEvent.press(screen.getByLabelText("Back"))

    expect(mockReplace).not.toHaveBeenCalled()

    expect(dismissModal).toHaveBeenCalledTimes(1)
    const afterDismiss = jest.mocked(dismissModal).mock.calls[0][0]
    afterDismiss?.()

    expect(navigate).toHaveBeenCalledWith("/search")
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
