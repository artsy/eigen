import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { MyCollection_me$data } from "__generated__/MyCollection_me.graphql"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { GlobalStore } from "app/store/GlobalStore"
import { cleanLocalImages } from "app/utils/LocalImageStore"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { useEffect, useState } from "react"
import {
  Alert,
  InteractionManager,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native"

import { RelayPaginationProp, graphql } from "react-relay"
import { MyCollectionArtworkList } from "./Components/MyCollectionArtworkList"
import { MyCollectionSearchBar } from "./Components/MyCollectionSearchBar"
import { MyCollectionArtworkEdge } from "./MyCollection"
import { myCollectionDeleteArtwork } from "./mutations/myCollectionDeleteArtwork"
import { localSortAndFilterArtworks } from "./utils/localArtworkSortAndFilter"

interface MyCollectionArtworksProps {
  me: MyCollection_me$data
  relay: RelayPaginationProp
  showSearchBar: boolean
  setShowSearchBar: (show: boolean) => void
}

export const MyCollectionArtworks: React.FC<MyCollectionArtworksProps> = ({
  me,
  relay,
  showSearchBar,
  setShowSearchBar,
}) => {
  const { height: screenHeight } = useScreenDimensions()

  const [minHeight, setMinHeight] = useState<number | undefined>(undefined)
  const [initialScrollPosition, setInitialScrollPosition] = useState(-1)

  const [keywordFilter, setKeywordFilter] = useState("")
  const viewOption = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)

  const artworks = extractNodes(me?.myCollectionConnection)

  const showMyCollectionDeleteAllArtworks = useDevToggle("DTMyCollectionDeleteAllArtworks")

  const filteredArtworks = localSortAndFilterArtworks(
    artworks as any,
    appliedFiltersState,
    filterOptions,
    keywordFilter
  )

  useEffect(() => {
    cleanLocalImages()
  }, [])

  // Make Search Bar visible when user scrolls to top
  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (showSearchBar) {
      return
    }

    if (initialScrollPosition === -1) {
      setInitialScrollPosition(nativeEvent.contentOffset.y)
      return
    }

    if (nativeEvent.contentOffset.y < initialScrollPosition) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })

      setShowSearchBar(true)
    }
  }

  return (
    <Flex minHeight={minHeight}>
      <Flex mb={1}>
        {!!showSearchBar && (
          <MyCollectionSearchBar
            searchString={keywordFilter}
            onChangeText={setKeywordFilter}
            onIsFocused={(isFocused) => {
              setMinHeight(isFocused ? screenHeight : undefined)
            }}
          />
        )}
      </Flex>
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
        viewOption === "grid" ? (
          <InfiniteScrollMyCollectionArtworksGridContainer
            myCollectionConnection={me.myCollectionConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            localSortAndFilterArtworks={(artworks: MyCollectionArtworkEdge[]) =>
              localSortAndFilterArtworks(
                artworks,
                appliedFiltersState,
                filterOptions,
                keywordFilter
              )
            }
            scrollEventThrottle={100}
            onScroll={handleScroll}
          />
        ) : (
          <MyCollectionArtworkList
            myCollectionConnection={me.myCollectionConnection}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            isLoading={relay.isLoading}
            localSortAndFilterArtworks={(artworks: MyCollectionArtworkEdge[]) =>
              localSortAndFilterArtworks(
                artworks,
                appliedFiltersState,
                filterOptions,
                keywordFilter
              )
            }
            scrollEventThrottle={100}
            onScroll={handleScroll}
          />
        )
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
    consignmentSubmission {
      displayText
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
