import { Spacer, Flex, Text, SkeletonBox, SkeletonText } from "@artsy/palette-mobile"
import {
  AuctionResultListItem_auctionResult$data,
  AuctionResultListItem_auctionResult$key,
} from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { useScreenDimensions } from "app/utils/hooks"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import { groupBy } from "lodash"
import moment from "moment"
import React from "react"
import { Animated, RefreshControl, SectionListData } from "react-native"
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
  ListHeaderComponent?: React.FC
  onItemPress: (item: AuctionResultListItem_auctionResult$data) => void
  isLoadingNext: boolean
  floatingHeaderTitle?: string
}

interface SectionT {
  [key: string]: any
}

export const AuctionResultsList: React.FC<AuctionResultsListProps> = ({
  auctionResults,
  refreshing,
  handleRefresh,
  onEndReached,
  ListHeaderComponent,
  onItemPress,
  isLoadingNext,
  floatingHeaderTitle,
}) => {
  const groupedAuctionResults = groupBy(auctionResults, (item) =>
    moment(item!.saleDate!).format("YYYY-MM")
  )

  const groupedAuctionResultSections: ReadonlyArray<SectionListData<any, SectionT>> =
    Object.entries(groupedAuctionResults).map(([date, data]) => {
      const sectionTitle = moment(date).format("MMMM, YYYY")

      return { sectionTitle, data }
    })

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flex={1} pl={6} pr={4} pt={0.5} flexDirection="row">
        <Text variant="sm" numberOfLines={1} style={{ flexShrink: 1 }}>
          {floatingHeaderTitle}
        </Text>
      </Flex>
    ),
  })

  return (
    <Flex flexDirection="column" justifyContent="space-between" pt={6}>
      <Animated.SectionList
        testID="Results_Section_List"
        sections={groupedAuctionResultSections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.internalID}
        stickySectionHeadersEnabled
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={() => <Flex mt={2} />}
        renderSectionHeader={({ section: { sectionTitle } }) => (
          <Flex backgroundColor="mono0" mx={2}>
            <Text my={2} variant="sm-display">
              {sectionTitle}
            </Text>
          </Flex>
        )}
        renderItem={({ item, index }) =>
          item ? (
            <AuctionResultListItemFragmentContainer
              first={index === 0}
              auctionResult={item}
              showArtistName
              onPress={() => onItemPress(item)}
            />
          ) : (
            <></>
          )
        }
        ListFooterComponent={() =>
          isLoadingNext ? (
            <Flex my={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        style={{ width: useScreenDimensions().width, paddingBottom: 40 }}
        {...scrollProps}
      />

      {headerElement}
    </Flex>
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
