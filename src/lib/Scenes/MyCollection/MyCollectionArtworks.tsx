import { addCollectedArtwork } from "@artsy/cohesion"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ZeroState } from "lib/Components/States/ZeroState"
import { navigate, popToRoot } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex } from "palette"
import React from "react"
import { graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworksList } from "./Components/MyCollectionArtworksList"
import { MyCollectionArtworkEdge } from "./MyCollection"
import { localSortAndFilterArtworks } from "./utils/localArtworkSortAndFilter"

interface MyCollectionArtworksProps {
  me: MyCollection_me
  keywordFilter: string
  relay: RelayPaginationProp
}

export const MyCollectionArtworks: React.FC<MyCollectionArtworksProps> = ({
  me,
  keywordFilter,
  relay,
}) => {
  const { height: screenHeight } = useScreenDimensions()
  const viewOption = GlobalStore.useAppState((state) => state.userPreferences.artworkViewOption)

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)

  const artworks = extractNodes(me?.myCollectionConnection)

  const filteredArtworks = localSortAndFilterArtworks(
    artworks as any,
    appliedFiltersState,
    filterOptions,
    keywordFilter
  )

  if (artworks.length === 0) {
    return <MyCollectionZeroState />
  }

  if (filteredArtworks.length === 0) {
    return (
      <Flex py="6" px="2">
        <FilteredArtworkGridZeroState hideClearButton />
      </Flex>
    )
  }

  return (
    <Flex pt={1}>
      {viewOption === "grid" ? (
        // Setting a min height to avoid a screen jump when switching to the grid view.
        <Flex minHeight={screenHeight}>
          <InfiniteScrollMyCollectionArtworksGridContainer
            myCollectionConnection={me.myCollectionConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            // tslint:disable-next-line: no-shadowed-variable
            localSortAndFilterArtworks={(artworks: MyCollectionArtworkEdge[]) =>
              localSortAndFilterArtworks(
                artworks,
                appliedFiltersState,
                filterOptions,
                keywordFilter
              )
            }
          />
        </Flex>
      ) : (
        <MyCollectionArtworksList
          myCollectionConnection={me.myCollectionConnection}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
          // tslint:disable-next-line: no-shadowed-variable
          localSortAndFilterArtworks={(artworks: MyCollectionArtworkEdge[]) =>
            localSortAndFilterArtworks(artworks, appliedFiltersState, filterOptions, keywordFilter)
          }
        />
      )}
    </Flex>
  )
}

const MyCollectionZeroState: React.FC = () => {
  const { trackEvent } = useTracking()

  return (
    <ZeroState
      title="Your art collection in your pocket."
      subtitle="Keep track of your collection all in one place and get market insights"
      callToAction={
        <Button
          testID="add-artwork-button-zero-state"
          onPress={() => {
            trackEvent(addCollectedArtwork())
            navigate("my-collection/artworks/new", {
              passProps: {
                mode: "add",
                onSuccess: popToRoot,
              },
            })
          }}
          block
        >
          Add artwork
        </Button>
      }
    />
  )
}

/**
 * * IMPORTANT *
 *
 * The following shared artwork fields are needed for sorting and filtering artworks locally
 *
 * When adding new filters this fragment needs to be updated.
 */
export const MyCollectionFilterPropsFragment = graphql`
  fragment MyCollectionArtworks_filterProps on Artwork {
    title
    slug
    id
    artistNames
    medium
    artist {
      internalID
      name
    }
    pricePaid {
      minor
    }
    sizeBucket
    width
    height
    date
  }
`
