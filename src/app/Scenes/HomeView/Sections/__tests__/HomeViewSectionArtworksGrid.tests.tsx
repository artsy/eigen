import { ContextModule } from "@artsy/cohesion"
import { HomeViewSectionArtworksGrid } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworksGrid"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockGenericGrid = jest.fn()

type ItemVisibilityChange = (artworkID: string, index: number, visible: boolean) => void

jest.mock("app/Components/ArtworkGrids/GenericGrid", () => ({
  __esModule: true,
  default: (props: { onItemVisibilityChange?: ItemVisibilityChange }) => {
    mockGenericGrid(props)
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

  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof HomeViewSectionArtworksGrid>>
  ) => {
    return renderWithWrappers(
      <HomeViewSectionArtworksGrid
        artworks={[] as any}
        moreHref="/view-all"
        onMorePress={onMorePress}
        onArtworkPress={onArtworkPress}
        trackItemImpressions
        contextModule={gridContextModule}
        {...props}
      />
    )
  }

  const getVisibilityCallback = (): ItemVisibilityChange => {
    const firstCallProps = mockGenericGrid.mock.calls[0]?.[0] as {
      onItemVisibilityChange?: ItemVisibilityChange
    }

    expect(firstCallProps?.onItemVisibilityChange).toBeDefined()
    return firstCallProps.onItemVisibilityChange as ItemVisibilityChange
  }

  beforeEach(() => {
    mockGenericGrid.mockClear()
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

  it("does not track when impression tracking is disabled", () => {
    renderComponent({ trackItemImpressions: false })

    const onItemVisibilityChange = getVisibilityCallback()
    onItemVisibilityChange("artwork-1", 0, true)

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })
})
