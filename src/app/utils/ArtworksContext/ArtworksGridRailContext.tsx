import { createContext, FC, useContext } from "react"

export type GridRailType = (typeof GRIDS_AND_RAILS)[number] | ""
type ShouldShowType = Record<(typeof SIGNAL_KEYS)[number], boolean>

interface ArtworksGridRailContextState {
  currentGridRail: GridRailType
  shouldShow: ShouldShowType
}

interface ArtworksGridRailProviderProps {
  currentGridRail: GridRailType
}

const ArtworksGridRailContext = createContext<ArtworksGridRailContextState>({
  currentGridRail: "",
  shouldShow: {
    LIMITED_TIME_OFFER: false,
  },
})

export const ArtworksGridRailProvider: FC<ArtworksGridRailProviderProps> = ({
  children,
  currentGridRail = "",
}) => {
  const getShouldRender = (gridRail: GridRailType): ShouldShowType => {
    switch (gridRail) {
      case "NEW_WORKS_FOR_YOU_RAIL":
      case "NEW_WORKS_FOR_YOU_GRID":
      case "CURATORS_PICKS_EMERGING_ARTISTS_RAIL":
      case "CURATORS_PICKS_EMERGING_ARTISTS_GRID":
      case "TRENDING_NOW_GRID":
      case "NEW_THIS_WEEK_GRID":
      case "CURATORS_PICKS_BLUE_CHIP_ARTISTS_GRID":
      case "SAVES_LIST_GRID":
      case "SEARCH_RESULTS_GRID":
      case "RECENTLY_VIEWED_RAIL":
      case "RECENTLY_VIEWED_GRID":
      case "ACTIVITY_PANEL_ARTWORKS_GRID":
      case "ARTWORK_DETAIL_GRID":
      case "ARTIST_ARTWORKS_GRID":
      case "GALLERY_WORKS_GRID":
        return { LIMITED_TIME_OFFER: true }

      case "AUCTION_LOTS_FOR_YOU_RAIL":
      case "AUCTION_LOTS_FOR_YOU_GRID":
      case "TOP_AUCTION_LOTS_GRID":
        return { LIMITED_TIME_OFFER: false }

      default:
        return {
          LIMITED_TIME_OFFER: false,
        }
    }
  }

  return (
    <ArtworksGridRailContext.Provider
      value={{ currentGridRail, shouldShow: getShouldRender(currentGridRail) }}
    >
      {children}
    </ArtworksGridRailContext.Provider>
  )
}

export const useArtworksGridRailContext = () => {
  return useContext(ArtworksGridRailContext)
}

const GRIDS_AND_RAILS = [
  "NEW_WORKS_FOR_YOU_RAIL",
  "NEW_WORKS_FOR_YOU_GRID",
  "AUCTION_LOTS_FOR_YOU_RAIL",
  "AUCTION_LOTS_FOR_YOU_GRID",
  "TOP_AUCTION_LOTS_GRID",
  "CURATORS_PICKS_EMERGING_ARTISTS_RAIL",
  "CURATORS_PICKS_EMERGING_ARTISTS_GRID",
  "TRENDING_NOW_GRID",
  "NEW_THIS_WEEK_GRID",
  "CURATORS_PICKS_BLUE_CHIP_ARTISTS_GRID",
  "SAVES_LIST_GRID",
  "SEARCH_RESULTS_GRID",
  "RECENTLY_VIEWED_RAIL",
  "RECENTLY_VIEWED_GRID",
  "ACTIVITY_PANEL_ARTWORKS_GRID",
  "ARTWORK_DETAIL_GRID",
  "AUCTION_DETAIL_GRID",
  "ARTIST_ARTWORKS_GRID",
  "GALLERY_WORKS_GRID",
] as const

const SIGNAL_KEYS = ["LIMITED_TIME_OFFER"] as const
