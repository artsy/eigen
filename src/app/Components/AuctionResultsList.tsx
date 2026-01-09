import { Spacer, Flex, Text, SkeletonBox, SkeletonText, Screen } from "@artsy/palette-mobile"
import {
  AuctionResultListItem_auctionResult$data,
  AuctionResultListItem_auctionResult$key,
} from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { groupBy } from "lodash"
import moment from "moment"
import React, { useMemo, useState, useCallback } from "react"
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
  onItemPress: (item: AuctionResultListItem_auctionResult$data) => void
  isLoadingNext: boolean
}

interface SectionItem {
  type: "section-header"
  sectionTitle: string
}

interface AuctionItem {
  type: "auction-item"
  item: AuctionResultListItem_auctionResult$key & { readonly saleDate: string | null | undefined }
  index: number
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
    const groupedAuctionResults = groupBy(auctionResults, (item) =>
      moment(item!.saleDate!).format("YYYY-MM")
    )

    const flatData: FlatListItem[] = []
    Object.entries(groupedAuctionResults).forEach(([date, items]) => {
      const sectionTitle = moment(date).format("MMMM, YYYY")
      flatData.push({ type: "section-header", sectionTitle })

      items.forEach((item, index) => {
        flatData.push({ type: "auction-item", item, index })
      })
    })

    return flatData
  }, [auctionResults])

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 1,
    minimumViewTime: 100,
  }

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        // Find the first auction item that's visible
        let firstAuctionItemIndex: number | null = null

        for (let i = 0; i < viewableItems.length; i++) {
          const item = viewableItems[i].item as FlatListItem
          if (item.type === "auction-item") {
            // Find the index of this item in the flatListData
            const index = flatListData.findIndex(
              (dataItem) =>
                dataItem.type === "auction-item" &&
                dataItem.item.internalID === item.item.internalID
            )
            if (index !== -1) {
              firstAuctionItemIndex = index
              break
            }
          }
        }

        // If we found an auction item, search backwards for the section header
        if (firstAuctionItemIndex !== null) {
          for (let i = firstAuctionItemIndex; i >= 0; i--) {
            const item = flatListData[i]
            if (item.type === "section-header") {
              setCurrentSectionTitle(item.sectionTitle)
              return
            }
          }
        }
      }
    },
    [flatListData]
  )

  const keyExtractor = (item: FlatListItem, index: number) => {
    if (item.type === "section-header") {
      return `section-${item.sectionTitle}`
    }
    return item.item.internalID
  }

  return (
    <>
      <Text variant="xs" mx={2}>
        See auction results for the artists you follow
      </Text>

      {!!currentSectionTitle && (
        <Flex
          //  backgroundColor="mono0"
          mx={2}
          py={2}
          /*   position="absolute"
          top={0}
          left={0}
          right={0} */
          zIndex={100}
        >
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
        ItemSeparatorComponent={() => <Flex backgroundColor="red" mt={2} />}
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

          return (
            <>
              {index === 1 && <Spacer y={-2} />}
              <AuctionResultListItemFragmentContainer
                auctionResult={item.item}
                showArtistName
                onPress={() => onItemPress(item.item as AuctionResultListItem_auctionResult$data)}
              />
            </>
          )
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

export const LoadingSkeleton: React.FC<{ title: string; listHeader: React.ReactElement }> = ({
  listHeader,
}) => {
  const placeholderResults = []
  for (let i = 0; i < 6; i++) {
    placeholderResults.push(
      <React.Fragment key={i}>
        <AuctionResultsListItemLoadingSkeleton />
      </React.Fragment>
    )
  }

  return (
    <ProvidePlaceholderContext>
      <Spacer y={6} />

      {listHeader}
      <Flex mx={2}>
        <Spacer y={2} />
        <SkeletonText variant="xs">Auctions date</SkeletonText>
        <Spacer y={2} />
        <Flex gap={2}>{placeholderResults}</Flex>
      </Flex>
    </ProvidePlaceholderContext>
  )
}
