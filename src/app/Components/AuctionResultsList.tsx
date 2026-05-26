import { Spacer, Flex, Text, SkeletonBox, SkeletonText, Screen } from "@artsy/palette-mobile"
import { AuctionResultListItem_auctionResult$key } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { groupBy } from "lodash"
import moment from "moment"
import React, { useMemo, useState, useCallback, useEffect } from "react"
import { RefreshControl, ViewabilityConfig, ViewToken } from "react-native"
import {
  AUCTION_RESULT_CARD_IMAGE_HEIGHT,
  AUCTION_RESULT_CARD_IMAGE_WIDTH,
  AuctionResultListItemFragmentContainer,
} from "./Lists/AuctionResultListItem"
import Spinner from "./Spinner"

interface AuctionResultsListProps {
  auctionResults: Array<
    AuctionResultListItem_auctionResult$key & { readonly saleDate: string | null | undefined }
  >
  refreshing: boolean
  handleRefresh: () => void
  onEndReached: () => void
  onItemPress: (
    item: AuctionResultListItem_auctionResult$key & { readonly saleDate: string | null | undefined }
  ) => void
  isLoadingNext: boolean
}

interface SectionItem {
  type: "section-header"
  sectionTitle: string
}

interface AuctionItem {
  type: "auction-item"
  item: AuctionResultListItem_auctionResult$key & { readonly saleDate: string | null | undefined }
  internalID: string
}

type FlatListItem = SectionItem | AuctionItem

export const AuctionResultsList: React.FC<AuctionResultsListProps> = ({
  auctionResults,
  refreshing,
  handleRefresh,
  onEndReached,
  onItemPress,
  isLoadingNext,
}) => {
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string | null>(null)

  const flatListData = useMemo(() => {
    // Group auction results by sale date (formatted as YYYY-MM)
    // Items without a saleDate are grouped under "no-date" key
    const groupedAuctionResults = groupBy(auctionResults, (item) => {
      if (!item?.saleDate) return "no-date"
      return moment(item.saleDate).format("YYYY-MM")
    })

    const flatData: FlatListItem[] = []
    Object.entries(groupedAuctionResults).forEach(([date, items]) => {
      // Format section title: either "MMMM, YYYY" for dated items or "No Date" for items without dates
      const sectionTitle = date === "no-date" ? "No Date" : moment(date).format("MMMM, YYYY")
      flatData.push({ type: "section-header", sectionTitle })

      items.forEach((item) => {
        flatData.push({ type: "auction-item", item, internalID: (item as any).internalID })
      })
    })

    return flatData
  }, [auctionResults])

  const findFirstSectionTitle = (data: FlatListItem[]) => {
    // Used to initialize the sticky header when the list first mounts.
    const first = data.find((i) => i.type === "section-header") as SectionItem | undefined
    return first ? first.sectionTitle : null
  }

  const findSectionTitleBeforeIndex = (data: FlatListItem[], startIndex: number) => {
    // Walk backwards from `startIndex` to find the nearest preceding section header.
    for (let i = startIndex; i >= 0; i--) {
      if (data[i].type === "section-header") {
        return (data[i] as SectionItem).sectionTitle
      }
    }
    return null
  }

  // Initialize `currentSectionTitle` from the data when the list first mounts or when `flatListData` changes
  useEffect(() => {
    if (currentSectionTitle == null) {
      const firstTitle = findFirstSectionTitle(flatListData)
      if (firstTitle) {
        setCurrentSectionTitle(firstTitle)
      }
    }
  }, [flatListData, currentSectionTitle])

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 1,
    minimumViewTime: 100,
  }

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return

      // Find first visible auction item
      const firstAuctionItem = viewableItems.find(
        (v) => (v.item as FlatListItem).type === "auction-item"
      )

      if (firstAuctionItem) {
        const visibleItemIndex = flatListData.findIndex(
          (item) =>
            item.type === "auction-item" &&
            item.internalID === (firstAuctionItem.item as AuctionItem).internalID
        )

        const title = findSectionTitleBeforeIndex(flatListData, visibleItemIndex)
        if (title) {
          setCurrentSectionTitle(title)
          return
        }
      }
    },
    [flatListData]
  )

  const keyExtractor = (item: FlatListItem) => {
    if (item.type === "section-header") {
      return `section-${item.sectionTitle}`
    }
    return item.internalID
  }

  return (
    <>
      {!!currentSectionTitle && (
        <Flex mx={2} pb={2}>
          <Text variant="sm-display">{currentSectionTitle}</Text>
        </Flex>
      )}
      <Screen.FlatList
        testID="Results_Section_List"
        data={flatListData}
        keyExtractor={keyExtractor}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={onEndReached}
        scrollEventThrottle={16}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ItemSeparatorComponent={() => <Flex mt={2} />}
        renderItem={({ item, index }) => {
          if (index === 0 && item.type === "section-header") {
            // Skip rendering the first section header since it's sticky
            return null
          }
          if (item.type === "section-header") {
            return (
              <Flex backgroundColor="mono0" mx={2}>
                <Text my={1} variant="sm-display">
                  {item.sectionTitle}
                </Text>
              </Flex>
            )
          }

          if (item.type === "auction-item") {
            const auctionItem = item as AuctionItem
            return (
              <>
                {index === 1 && <Spacer y={-2} />}
                <AuctionResultListItemFragmentContainer
                  auctionResult={auctionItem.item}
                  showArtistName
                  onPress={() => onItemPress(auctionItem.item)}
                />
              </>
            )
          }

          return null
        }}
        ListFooterComponent={() =>
          isLoadingNext ? (
            <Flex my={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </>
  )
}

export const AuctionResultsListItemLoadingSkeleton: React.FC = () => {
  return (
    <Flex flexDirection="row" flexGrow={1}>
      {/* Image */}
      <SkeletonBox
        width={AUCTION_RESULT_CARD_IMAGE_WIDTH}
        height={AUCTION_RESULT_CARD_IMAGE_HEIGHT}
      />
      <Spacer x="15px" />
      <Flex justifyContent="space-between" py={0.5} flexGrow={1}>
        <Flex gap={0.5}>
          {/* Artist name */}
          <SkeletonText variant="xxs">Artist Name</SkeletonText>
          {/* Artwork name */}
          <SkeletonText variant="xxs">Artwork Name</SkeletonText>
          {/* Artwork medium */}
          <SkeletonText variant="xxs">Medium</SkeletonText>
          {/* Auction Date & Place */}
          <SkeletonText variant="xxs">Date & Place</SkeletonText>
        </Flex>
        <Flex gap={0.5}>
          {/* Price */}
          <SkeletonText variant="xxs">Some price value</SkeletonText>
          {/* Mid estimate */}
          <SkeletonText variant="xxs">Some mid estimate</SkeletonText>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const LoadingSkeleton: React.FC<{ title: string; subTitle: string }> = ({
  title,
  subTitle,
}) => {
  return (
    <ProvidePlaceholderContext>
      <Screen.AnimatedHeader title={title} />
      <Screen.StickySubHeader title={title} subTitle={subTitle} />
      <Screen.Body fullwidth>
        <Flex mx={2}>
          <Spacer y={2} />
          <SkeletonText variant="sm-display">Auctions date</SkeletonText>
          <Spacer y={2} />
          <Flex gap={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <AuctionResultsListItemLoadingSkeleton key={index} />
            ))}
          </Flex>
          <Spacer y={2} />
        </Flex>
      </Screen.Body>
    </ProvidePlaceholderContext>
  )
}
