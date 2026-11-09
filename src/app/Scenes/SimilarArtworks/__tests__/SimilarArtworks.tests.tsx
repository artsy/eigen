import FastImage from "@d11/react-native-fast-image"
import { act, fireEvent, screen, within } from "@testing-library/react-native"
import { SimilarArtworksScreen } from "app/Scenes/SimilarArtworks/SimilarArtworks"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SimilarArtworks", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SimilarArtworksScreen artworkID="source-artwork" />,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("searches by the given artwork", () => {
    const env = getMockRelayEnvironment()

    renderWithWrappers(<SimilarArtworksScreen artworkID="source-artwork" />)

    const operation = env.mock.getMostRecentOperation()
    expect(operation.request.node.operation.name).toBe("SimilarArtworksQuery")
    expect(operation.request.variables).toMatchObject({ artworkID: "source-artwork" })
  })

  it("renders similar artworks", async () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Cool Painting",
        slug: "cool-painting",
        href: "/artwork/cool-painting",
      }),
    })

    expect(await screen.findByText("Works similar to this artwork")).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("artworkGridItem-Cool Painting"))

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/artwork/cool-painting")
  })

  it("shows the source artwork's image in the header", async () => {
    renderWithRelay({
      Artwork: () => ({ title: "Cool Painting", image: { url: "https://example.com/image.jpg" } }),
    })

    const thumbnail = within(
      await screen.findByTestId("lensResultsPhotoThumbnail")
    ).UNSAFE_getByType(FastImage)

    expect(thumbnail.props.source.uri).toBe("https://example.com/image.jpg")
  })

  it("shows an empty state when there are no similar artworks", async () => {
    renderWithRelay({ FilterArtworksConnection: () => ({ edges: [] }) })

    expect(
      await screen.findByText("We couldn't find similar works for this artwork yet.")
    ).toBeOnTheScreen()
  })

  it("returns to the previous screen when backing out", async () => {
    renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    await screen.findByText("Works similar to this artwork")

    fireEvent.press(screen.getByLabelText("Back"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("loads more artworks when reaching the end of the list", async () => {
    const { env, mockResolveLastOperation } = renderWithRelay({
      FilterArtworksConnection: () => ({
        edges: [{ node: { title: "Artwork 1", slug: "artwork-1" } }],
        pageInfo: { hasNextPage: true, endCursor: "cursor-1" },
      }),
    })

    fireEvent(await screen.findByTestId("masonry-artwork-grid"), "onEndReached")

    const operation = env.mock.getMostRecentOperation()
    expect(operation.request.node.operation.name).toBe("SimilarArtworksPaginationQuery")
    expect(operation.request.variables).toMatchObject({
      artworkID: "source-artwork",
      after: "cursor-1",
    })

    mockResolveLastOperation({
      FilterArtworksConnection: () => ({
        edges: [{ node: { title: "Artwork 2", slug: "artwork-2" } }],
        pageInfo: { hasNextPage: false, endCursor: "cursor-2" },
      }),
    })

    expect(screen.getByTestId("artworkGridItem-Artwork 1")).toBeOnTheScreen()
    expect(await screen.findByTestId("artworkGridItem-Artwork 2")).toBeOnTheScreen()
  })

  it("shows the empty state instead of crashing when the search fails", async () => {
    const env = getMockRelayEnvironment()

    renderWithWrappers(<SimilarArtworksScreen artworkID="source-artwork" />)

    expect(screen.getByText("Searching for similar works…")).toBeOnTheScreen()

    act(() => {
      env.mock.rejectMostRecentOperation(new Error("Unknown argument artworkID"))
    })

    expect(
      await screen.findByText("We couldn't find similar works for this artwork yet.")
    ).toBeOnTheScreen()
    expect(screen.getByLabelText("Back")).toBeOnTheScreen()
  })
})
