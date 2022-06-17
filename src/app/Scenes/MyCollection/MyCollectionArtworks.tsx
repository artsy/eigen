import { addCollectedArtwork } from "@artsy/cohesion"
import { MyCollection_me$data } from "__generated__/MyCollection_me.graphql"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ZeroState } from "app/Components/States/ZeroState"
import { navigate, popToRoot } from "app/navigation/navigate"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { Button, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import {
  FlatList,
  Image,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native"
import { graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { Tab } from "../MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { MyCollectionArtworkList } from "./Components/MyCollectionArtworkList"
import { MyCollectionSearchBar } from "./Components/MyCollectionSearchBar"
import { MyCollectionArtworkEdge } from "./MyCollection"
import { localSortAndFilterArtworks } from "./utils/localArtworkSortAndFilter"

interface MyCollectionArtworksProps {
  me: MyCollection_me$data
  relay: RelayPaginationProp
  innerFlatlistRef?: React.MutableRefObject<{ getNode(): FlatList<any> } | null>
  showSearchBar: boolean
  setShowSearchBar: (show: boolean) => void
}

export const MyCollectionArtworks: React.FC<MyCollectionArtworksProps> = ({
  me,
  relay,
  innerFlatlistRef,
  showSearchBar,
  setShowSearchBar,
}) => {
  const { height: screenHeight } = useScreenDimensions()
  const enabledSearchBar = useFeatureFlag("AREnableMyCollectionSearchBar")

  const [minHeight, setMinHeight] = useState<number | undefined>(undefined)
  const [initialScrollPosition, setInitialScrollPosition] = useState(-1)

  const [keywordFilter, setKeywordFilter] = useState("")
  const viewOption = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

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
            innerFlatListRef={innerFlatlistRef}
            onIsFocused={(isFocused) => {
              setMinHeight(isFocused ? screenHeight : undefined)
            }}
          />
        )}
      </Flex>
      {filteredArtworks.length > 0 ? (
        viewOption === "grid" ? (
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
            scrollEventThrottle={100}
            onScroll={enabledSearchBar ? handleScroll : undefined}
          />
        ) : (
          <MyCollectionArtworkList
            myCollectionConnection={me.myCollectionConnection}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            isLoading={relay.isLoading}
            // tslint:disable-next-line: no-shadowed-variable
            localSortAndFilterArtworks={(artworks: MyCollectionArtworkEdge[]) =>
              localSortAndFilterArtworks(
                artworks,
                appliedFiltersState,
                filterOptions,
                keywordFilter
              )
            }
            scrollEventThrottle={100}
            onScroll={enabledSearchBar ? handleScroll : undefined}
          />
        )
      ) : (
        <Flex py="6" px="2">
          <FilteredArtworkGridZeroState hideClearButton />
        </Flex>
      )}

      {filteredArtworks.length > 0 && <Spacer mb={2} />}
    </Flex>
  )
}

const MyCollectionZeroState: React.FC = () => {
  const { trackEvent } = useTracking()

  return (
    <ZeroState
      title="Primed and ready for artworks."
      subtitle="Add works from your collection to access price and market insights."
      callToAction={
        <>
          <Button
            testID="add-artwork-button-zero-state"
            onPress={() => {
              trackEvent(addCollectedArtwork())
              navigate("my-collection/artworks/new", {
                passProps: {
                  mode: "add",
                  source: Tab.collection,
                  onSuccess: popToRoot,
                },
              })
            }}
            block
          >
            Upload Your Artwork
          </Button>
          <Flex flexDirection="row" justifyContent="center" alignItems="center" py={1}>
            <Image source={require("images/lock.webp")} />
            <Text color="black60" pl={1} variant="xs">
              My Collection is not shared with sellers.
            </Text>
          </Flex>
        </>
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
