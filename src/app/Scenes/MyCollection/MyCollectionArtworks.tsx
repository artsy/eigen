import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollection_me$data } from "__generated__/MyCollection_me.graphql"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ZeroState } from "app/Components/States/ZeroState"
import { navigate, popToRoot } from "app/navigation/navigate"
import { GlobalStore, useDevToggle, useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { Button, Flex, LockIcon, Spacer, Text } from "palette"
import { useState } from "react"
import {
  Alert,
  InteractionManager,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native"

import { graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { refreshMyCollection } from "../../utils/refreshHelpers"
import { Tab } from "../MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { MyCollectionArtworkList } from "./Components/MyCollectionArtworkList"
import { MyCollectionSearchBar } from "./Components/MyCollectionSearchBar"
import { myCollectionDeleteArtwork } from "./mutations/myCollectionDeleteArtwork"
import { MyCollectionArtworkEdge } from "./MyCollection"
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
  const enabledSearchBar = useFeatureFlag("AREnableMyCollectionSearchBar")

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
              trackEvent(tracks.addCollectedArtwork())
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
            <LockIcon fill="black60" />
            <Text color="black60" pl={0.5} variant="xs">
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

const tracks = {
  addCollectedArtwork: (): AddCollectedArtwork => ({
    action: ActionType.addCollectedArtwork,
    context_module: ContextModule.myCollectionHome,
    context_owner_type: OwnerType.myCollection,
    platform: "mobile",
  }),
}
