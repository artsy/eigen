import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { MyCollectionLegacy_me$data } from "__generated__/MyCollectionLegacy_me.graphql"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { cleanLocalImages } from "app/utils/LocalImageStore"
import { extractNodes } from "app/utils/extractNodes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { useEffect } from "react"
import { Alert, InteractionManager } from "react-native"
import { RelayPaginationProp, graphql } from "react-relay"
import { MyCollectionArtworkEdge } from "./MyCollectionLegacy"
import { myCollectionDeleteArtwork } from "./mutations/myCollectionDeleteArtwork"
import { localSortAndFilterArtworks } from "./utils/localArtworkSortAndFilter"

interface MyCollectionArtworksProps {
  me: MyCollectionLegacy_me$data
  relay: RelayPaginationProp
}

export const MyCollectionArtworks: React.FC<MyCollectionArtworksProps> = ({ me, relay }) => {
  const query = MyCollectionArtworksKeywordStore.useStoreState((state) => state.keyword)

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)

  const artworks = extractNodes(me?.myCollectionConnection)

  const showMyCollectionDeleteAllArtworks = useDevToggle("DTMyCollectionDeleteAllArtworks")

  const filteredArtworks = localSortAndFilterArtworks(
    artworks as any,
    appliedFiltersState,
    filterOptions,
    query
  )

  useEffect(() => {
    cleanLocalImages()
  }, [])

  if (!me.myCollectionConnection) {
    console.warn("Something went wrong, me.myCollectionConnection failed to load")
    return null
  }

  return (
    <Flex px={2}>
      {!!showMyCollectionDeleteAllArtworks && artworks.length > 0 && (
        <Button
          onPress={() => {
            Alert.alert(
              "Delete all artworks",
              "Are you sure you want to delete all artworks in your collection?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    await Promise.all(
                      artworks.map(async (artwork) => {
                        await myCollectionDeleteArtwork(artwork.internalID)
                      })
                    )
                      .then(() => {
                        InteractionManager.runAfterInteractions(() => {
                          Alert.alert("All artworks deleted")
                          refreshMyCollection()
                        })
                      })
                      .catch(() => {
                        InteractionManager.runAfterInteractions(() => {
                          Alert.alert("Couldn't delete your artworks")
                        })
                      })
                  },
                  style: "destructive",
                },
              ]
            )
          }}
          block
          variant="outlineGray"
          mb={1}
        >
          <Text color="red100">Delete all artworks</Text>
        </Button>
      )}
      {filteredArtworks.length > 0 ? (
        <InfiniteScrollMyCollectionArtworksGridContainer
          myCollectionConnection={me.myCollectionConnection}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          localSortAndFilterArtworks={(artworks: MyCollectionArtworkEdge[]) =>
            localSortAndFilterArtworks(artworks, appliedFiltersState, filterOptions, query)
          }
        />
      ) : (
        <Flex py={6} px={2}>
          <FilteredArtworkGridZeroState hideClearButton />
        </Flex>
      )}

      {filteredArtworks.length > 0 && <Spacer y={2} />}
    </Flex>
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
    mediumType {
      name
    }
    attributionClass {
      name
    }
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
    marketPriceInsights {
      demandRank
    }
  }
`
