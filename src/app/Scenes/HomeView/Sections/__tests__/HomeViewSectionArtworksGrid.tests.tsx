import { ContextModule, OwnerType } from "@artsy/cohesion"
import { HomeViewSectionArtworksGridTestsQuery } from "__generated__/HomeViewSectionArtworksGridTestsQuery.graphql"
import { HomeViewSectionArtworksGrid } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworksGrid"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockGridItem = jest.fn()

type ItemVisibilityChange = (artworkID: string, index: number, visible: boolean) => void

jest.mock("app/Components/ArtworkGrids/MasonryArtworkGridItem", () => ({
  MasonryArtworkGridItem: (props: { onItemVisibilityChange?: ItemVisibilityChange }) => {
    mockGridItem(props)
    return null
  },
}))

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))

describe("HomeViewSectionArtworksGrid", () => {
  const onMorePress = jest.fn()
  const onArtworkPress = jest.fn()
  const gridContextModule = "newWorksForYouGrid" as ContextModule

  const getWrapper = (props?: Partial<React.ComponentProps<typeof HomeViewSectionArtworksGrid>>) =>
    setupTestWrapper<HomeViewSectionArtworksGridTestsQuery>({
      Component: ({ artworksConnection }) => (
        <HomeViewSectionArtworksGrid
          artworks={extractNodes(artworksConnection)}
          moreHref="/view-all"
          onMorePress={onMorePress}
          onArtworkPress={onArtworkPress}
          trackItemImpressions
          contextModule={gridContextModule}
          {...props}
        />
      ),
      query: graphql`
        query HomeViewSectionArtworksGridTestsQuery @relay_test_operation {
          artworksConnection(first: 4) {
            edges {
              node {
                ...GenericGrid_artworks
              }
            }
          }
        }
      `,
    })

  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof HomeViewSectionArtworksGrid>>,
    mockResolvers?: Parameters<ReturnType<typeof getWrapper>["renderWithRelay"]>[0]
  ) => getWrapper(props).renderWithRelay(mockResolvers)

  const getVisibilityCallback = (): ItemVisibilityChange => {
    const firstCallProps = mockGridItem.mock.calls[0]?.[0] as {
      onItemVisibilityChange?: ItemVisibilityChange
    }

    expect(firstCallProps?.onItemVisibilityChange).toBeDefined()
    return firstCallProps.onItemVisibilityChange as ItemVisibilityChange
  }

  beforeEach(() => {
    mockGridItem.mockClear()
    mockTrackEvent.mockClear()
    ;(useFeatureFlag as jest.Mock).mockReturnValue(true)
  })

  it("tracks item_viewed only once per artwork id", () => {
    renderComponent()

    const onItemVisibilityChange = getVisibilityCallback()

    onItemVisibilityChange("artwork-1", 0, true)
    onItemVisibilityChange("artwork-1", 0, true)
    onItemVisibilityChange("artwork-1", 0, false)
    onItemVisibilityChange("artwork-2", 1, true)

    expect(mockTrackEvent).toHaveBeenCalledTimes(2)
    expect(mockTrackEvent).toHaveBeenNthCalledWith(
      1,
      HomeAnalytics.trackItemViewed({
        artworkId: "artwork-1",
        contextModule: gridContextModule,
        position: 0,
        type: "artwork",
      })
    )
    expect(mockTrackEvent).toHaveBeenNthCalledWith(
      2,
      HomeAnalytics.trackItemViewed({
        artworkId: "artwork-2",
        contextModule: gridContextModule,
        position: 1,
        type: "artwork",
      })
    )
  })

  it("passes home analytics context to every artwork", () => {
    renderComponent()

    expect(mockGridItem).toHaveBeenCalledWith(
      expect.objectContaining({
        contextModule: gridContextModule,
        contextScreenOwnerType: OwnerType.home,
      })
    )
  })

  it("renders every artwork it is given, so impressions can be tracked for each", () => {
    renderComponent(undefined, {
      FilterArtworksConnection: () => ({
        edges: [
          { node: { id: "artwork-1" } },
          { node: { id: "artwork-2" } },
          { node: { id: "artwork-3" } },
          { node: { id: "artwork-4" } },
        ],
      }),
    })

    expect(mockGridItem).toHaveBeenCalledTimes(4)
    // Positions are the artworks' own, not their position within a column
    expect(mockGridItem.mock.calls.map(([props]) => props.index).sort()).toEqual([0, 1, 2, 3])
  })

  it("does not track when impression tracking is disabled", () => {
    renderComponent({ trackItemImpressions: false })

    const onItemVisibilityChange = getVisibilityCallback()
    onItemVisibilityChange("artwork-1", 0, true)

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })
})
