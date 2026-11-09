import { OwnerType } from "@artsy/cohesion"
import { MoreIcon } from "@artsy/icons/native"
import {
  Box,
  Flex,
  Screen,
  Separator,
  SkeletonBox,
  SkeletonText,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import {
  SharedArtworkListQuery,
  CollectionArtworkSorts,
} from "__generated__/SharedArtworkListQuery.graphql"
import { SharedArtworkList_query$key } from "__generated__/SharedArtworkList_query.graphql"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { SortByModal, SortOption } from "app/Components/SortByModal/SortByModal"
import { artworkListVariables } from "app/Scenes/ArtworkList/ArtworkList"
import { ArtworkListArtworksGridHeader } from "app/Scenes/ArtworkList/ArtworkListArtworksGridHeader"
import { ManageArtworkListView } from "app/Scenes/ArtworkList/ManageArtworkListView"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC, Suspense, useCallback, useRef, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SharedArtworkListScreenProps {
  collectionID: string
  userID: string
}

const SORT_OPTIONS: SortOption[] = [
  { value: "SAVED_AT_DESC", text: "Recently Added" },
  { value: "SAVED_AT_ASC", text: "First Added" },
]

const DEFAULT_SORT_OPTION = SORT_OPTIONS[0].value as CollectionArtworkSorts

export const SharedArtworkList: FC<SharedArtworkListScreenProps> = ({ collectionID, userID }) => {
  const [sortModalVisible, setSortModalVisible] = useState(false)
  const [selectedSortValue, setSelectedSortValue] = useState(DEFAULT_SORT_OPTION)
  const [isManageViewVisible, setIsManageViewVisible] = useState(false)
  const selectedSortValueRef = useRef(DEFAULT_SORT_OPTION)
  const lastFetchedSortValueRef = useRef(DEFAULT_SORT_OPTION)

  const currentUserID = GlobalStore.useAppState((state) => state.auth.userID)
  const isOwner = currentUserID === userID

  const queryData = useLazyLoadQuery<SharedArtworkListQuery>(
    SharedArtworkListScreenQuery,
    { collectionID, userID, ...artworkListVariables },
    { fetchPolicy: "store-and-network" }
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    SharedArtworkListQuery,
    SharedArtworkList_query$key
  >(sharedArtworkListFragment, queryData)

  const RefreshControl = useRefreshControl(refetch, { sort: selectedSortValue })

  const handleSortByModalClosed = () => {
    setSortModalVisible(false)

    const newSortValue = selectedSortValueRef.current

    if (newSortValue === lastFetchedSortValueRef.current) {
      return
    }

    lastFetchedSortValueRef.current = newSortValue
    refetch({ sort: newSortValue }, { fetchPolicy: "store-and-network" })
  }

  const handleSelectOption = (option: SortOption) => {
    selectedSortValueRef.current = option.value as CollectionArtworkSorts
    setSelectedSortValue(option.value as CollectionArtworkSorts)
    setSortModalVisible(false)
  }

  const closeManageView = useCallback(() => {
    setIsManageViewVisible(false)
  }, [])

  const collection = queryData.collection

  if (!collection) {
    return (
      <>
        <NavigationHeader onLeftButtonPress={goBack} hideBottomDivider />
        <Flex flex={1} justifyContent="center" alignItems="center" mx={2}>
          <Text variant="sm" color="mono60" textAlign="center">
            This list is private or no longer available.
          </Text>
        </Flex>
      </>
    )
  }

  const artworksCount = data?.collection?.artworks?.totalCount ?? 0
  const artworks = extractNodes(data?.collection?.artworks)

  const artworkListEntity: HeaderMenuArtworkListEntity | null = isOwner
    ? {
        title: collection.name,
        internalID: collection.internalID,
        shareableWithPartners: collection.shareableWithPartners,
        slug: collection.slug ?? null,
        private: collection.private,
        default: collection.default,
      }
    : null

  return (
    <>
      <NavigationHeader
        onLeftButtonPress={goBack}
        renderRightButton={() => {
          if (artworkListEntity) {
            return (
              <MoreIcon
                fill="mono100"
                width={24}
                height={24}
                accessibilityLabel="Contextual Menu Button"
              />
            )
          }
          return <></>
        }}
        rightButtonDisabled={!artworkListEntity}
        onRightButtonPress={() => setIsManageViewVisible(true)}
        hideBottomDivider
      />

      <MasonryInfiniteScrollArtworkGrid
        artworks={artworks}
        loadMore={(pageSize) => loadNext(pageSize)}
        hasMore={hasNext}
        isLoading={isLoadingNext}
        ListHeaderComponent={
          <Box mx={-1}>
            <ArtworkListArtworksGridHeader
              title={collection?.name ?? ""}
              artworksCount={artworksCount}
              shareableWithPartners={collection?.shareableWithPartners ?? false}
              onSortButtonPress={() => setSortModalVisible(true)}
            />
          </Box>
        }
        refreshControl={RefreshControl}
      />

      <SortByModal
        visible={sortModalVisible}
        options={SORT_OPTIONS}
        selectedValue={selectedSortValue}
        onSelectOption={handleSelectOption}
        onModalFinishedClosing={handleSortByModalClosed}
      />

      {!!(isManageViewVisible && artworkListEntity) && (
        <ManageArtworkListView artworkListEntity={artworkListEntity} onDismiss={closeManageView} />
      )}
    </>
  )
}

export const SharedArtworkListScreenQuery = graphql`
  query SharedArtworkListQuery(
    $collectionID: String!
    $userID: String!
    $count: Int
    $after: String
    $sort: CollectionArtworkSorts
  ) {
    collection(id: $collectionID, userID: $userID) {
      default
      name
      internalID
      slug
      private
      shareableWithPartners
    }
    ...SharedArtworkList_query
      @arguments(
        collectionID: $collectionID
        userID: $userID
        count: $count
        after: $after
        sort: $sort
      )
  }
`

const sharedArtworkListFragment = graphql`
  fragment SharedArtworkList_query on Query
  @refetchable(queryName: "SharedArtworkList_queryRefetch")
  @argumentDefinitions(
    collectionID: { type: "String!" }
    userID: { type: "String!" }
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    sort: { type: "CollectionArtworkSorts" }
  ) {
    collection(id: $collectionID, userID: $userID) {
      artworks: artworksConnection(first: $count, after: $after, sort: $sort)
        @connection(key: "SharedArtworkList_artworks") {
        totalCount
        edges {
          node {
            id
            slug
            image(includeAll: false) {
              aspectRatio
              blurhash
            }
            ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          }
        }
      }
    }
  }
`

export const SharedArtworkListScreen: FC<SharedArtworkListScreenProps> = (props) => {
  return (
    <Screen>
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({
          context_screen_owner_type: OwnerType.artworkList,
          context_screen_owner_id: props.collectionID,
        })}
      >
        <Suspense fallback={<SharedArtworkListPlaceholder />}>
          <SharedArtworkList {...props} />
        </Suspense>
      </ProvideScreenTrackingWithCohesionSchema>
    </Screen>
  )
}

const SharedArtworkListPlaceholder: FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  return (
    <ProvidePlaceholderContext>
      <NavigationHeader onLeftButtonPress={goBack} hideBottomDivider />

      <Flex px={2}>
        <SkeletonText mb={2} variant="lg">
          Saved Artworks
        </SkeletonText>
        <Separator borderColor="mono10" mt={1} mb={2} />
        <Flex justifyContent="space-between" flexDirection="row" mb={2}>
          <SkeletonText variant="xs">0 Artworks</SkeletonText>
          <SkeletonBox width={80} height={22} />
        </Flex>
        <GenericGridPlaceholder width={width - space(4)} />
      </Flex>
    </ProvidePlaceholderContext>
  )
}
