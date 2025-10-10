import { Spacer, Flex, Text, Separator } from "@artsy/palette-mobile"
import {
  AuctionResultListItem_auctionResult$data,
  AuctionResultListItem_auctionResult$key,
} from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import { groupBy } from "lodash"
import moment from "moment"
import React from "react"
import { Animated, RefreshControl, SectionListData } from "react-native"
import { AuctionResultListItemFragmentContainer } from "./Lists/AuctionResultListItem"
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

export const LoadingSkeleton: React.FC<{ title: string; listHeader: React.ReactElement }> = ({
  listHeader,
}) => {
  const placeholderResults = []
  for (let i = 0; i < 8; i++) {
    placeholderResults.push(
      <React.Fragment key={i}>
        <Spacer y={2} />
        <Flex flexDirection="row" flexGrow={1}>
          {/* Image */}
          <PlaceholderBox width={60} height={60} />
          <Spacer x="15px" />
          <Flex flexDirection="row" justifyContent="space-between" py={0.5} flexGrow={1}>
            <Flex>
              {/* Artist name */}
              <PlaceholderText width={100} />
              {/* Artwork name */}
              <PlaceholderText width={150} />
              {/* Artwork medium */}
              <PlaceholderText width={125} />
              {/* Auction Date & Place */}
              <PlaceholderText width={100} />
            </Flex>
            <Flex alignItems="flex-end" pr={1}>
              {/* Price */}
              <PlaceholderText width={40} />
              {/* Mid estimate */}
              <PlaceholderText width={65} />
            </Flex>
          </Flex>
        </Flex>
        <Spacer y={1} />
        <Separator borderColor="mono10" />
      </React.Fragment>
    )
  }
  return (
    <ProvidePlaceholderContext>
      <Spacer y={6} />

      {listHeader}
      <Flex mx={2}>
        <Spacer y={2} />
        <PlaceholderText height={24} width={100 + Math.random() * 50} />
        <Spacer y={1} />
        <Separator borderColor="mono10" />
        {placeholderResults}
      </Flex>
    </ProvidePlaceholderContext>
  )
}
