import { screen } from "@testing-library/react-native"
import { ArtworkHeaderTestsQuery } from "__generated__/ArtworkHeaderTestsQuery.graphql"
import { ArtworkListsProvider } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkHeaderFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("react-native-view-shot", () => ({}))

const mockRefetch = jest.fn()

describe("ArtworkHeader", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkHeaderTestsQuery>({
    Component: ({ artwork }) => (
      <ArtworkListsProvider>
        <ArtworkHeaderFragmentContainer artwork={artwork!} refetchArtwork={mockRefetch} />
      </ArtworkListsProvider>
    ),
    query: graphql`
      query ArtworkHeaderTestsQuery @relay_test_operation {
        artwork(id: "abbas-kiarostami-untitled-7") {
          ...ArtworkHeader_artwork
        }
      }
    `,
  })

  it("renders correctly", async () => {
    await renderWithRelay({
      Artwork: () => ({
        title: "Mock Artwork Title",
        date: null,
        figures: [{ __typename: "Image", url: "https://example.com/image.jpg" }],
      }),
    })

    // tombstone
    expect(screen.getAllByText("Mock Artwork Title")).toHaveLength(1)

    // actions component
    expect(screen.getAllByText("Share")).toHaveLength(1)

    // image carousel component
    expect(screen.getAllByLabelText("Image Carousel")).toHaveLength(1)
  })
})
