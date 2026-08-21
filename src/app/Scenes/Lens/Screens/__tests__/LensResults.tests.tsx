import { fireEvent, screen } from "@testing-library/react-native"
import { LensResultsTestsQuery } from "__generated__/LensResultsTestsQuery.graphql"
import { LensResultsScreen } from "app/Scenes/Lens/Screens/LensResults"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const photo = { uri: "file:///tmp/photo.jpg", width: 400, height: 300 }

describe("LensResults", () => {
  const { renderWithRelay } = setupTestWrapper<LensResultsTestsQuery>({
    Component: () => (
      <LensResultsScreen
        route={
          {
            key: "LensResults",
            name: "LensResults",
            params: { s3Bucket: "my-bucket", s3Key: "my-key", photo },
          } as any
        }
        navigation={{} as any}
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

  // Regression coverage for "PUSH ... was not handled by any navigator. Do you have a screen
  // named 'Artwork'?" -- see LensResults.tsx for the root cause.
  it("dismisses the Lens modal, then navigates to the artwork by internalID (not slug)", () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Cool Painting",
        slug: "some-artwork-slug",
        internalID: "abc123",
      }),
    })

    fireEvent.press(screen.getByTestId("artworkGridItem-Cool Painting"))

    // Unsuppressed, the default RouterLink navigation fires synchronously with the slug-based
    // href, before dismissModal's callback runs.
    expect(navigate).not.toHaveBeenCalledWith(expect.stringContaining("some-artwork-slug"))

    expect(dismissModal).toHaveBeenCalledTimes(1)
    const afterDismiss = jest.mocked(dismissModal).mock.calls[0][0]
    afterDismiss?.()

    expect(navigate).toHaveBeenCalledWith("/artwork/abc123")
  })
})
