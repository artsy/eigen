import {
  AuctionResultListItem_auctionResult,
  AuctionResultListItem_auctionResult$key,
} from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Separator, Spacer, Text } from "palette"
import React from "react"
import { RefreshControl, SectionList, SectionListData } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { AuctionResultListItemFragmentContainer } from "./Lists/AuctionResultListItem"
import { PageWithSimpleHeader } from "./PageWithSimpleHeader"
import Spinner from "./Spinner"

interface AuctionResultsListProps {
  auctionResults: Array<
    AuctionResultListItem_auctionResult$key & { readonly saleDate: string | null }
  >
  refreshing: boolean
  handleRefresh: () => void
  onEndReached: () => void
  ListHeaderComponent: React.ReactElement
  onItemPress: (item: AuctionResultListItem_auctionResult) => void
  isLoadingNext: boolean
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
}) => {
  const groupedAuctionResults = groupBy(auctionResults, (item) =>
    moment(item!.saleDate!).format("YYYY-MM")
  )

  const groupedAuctionResultSections: ReadonlyArray<SectionListData<any, SectionT>> =
    Object.entries(groupedAuctionResults).map(([date, data]) => {
      const sectionTitle = moment(date).format("MMMM, YYYY")

      return { sectionTitle, data }
    })

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <SectionList
        testID="Results_Section_List"
        sections={groupedAuctionResultSections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.internalID}
        stickySectionHeadersEnabled
        ListHeaderComponent={ListHeaderComponent}
        renderSectionHeader={({ section: { sectionTitle } }) => (
          <Flex bg="white" mx="2">
            <Text my="2" variant="md">
              {sectionTitle}
            </Text>
            <Separator borderColor="black10" />
          </Flex>
        )}
        renderItem={({ item }) =>
          item ? (
            <AuctionResultListItemFragmentContainer
              auctionResult={item}
              showArtistName
              onPress={() => onItemPress(item)}
            />
          ) : (
            <></>
          )
        }
        ListFooterComponent={
          isLoadingNext ? (
            <Flex my={3} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        style={{ width: useScreenDimensions().width, paddingBottom: 40 }}
      />
    </Flex>
  )
}

export const LoadingSkeleton: React.FC<{ title: string; listHeader: React.ReactElement }> = ({
  title,
  listHeader,
}) => {
  const placeholderResults = []
  for (let i = 0; i < 8; i++) {
    placeholderResults.push(
      <React.Fragment key={i}>
        <Spacer height={20} />
        <Flex flexDirection="row" flexGrow={1}>
          {/* Image */}
          <PlaceholderBox width={60} height={60} />
          <Spacer width={15} />
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
        <Spacer height={10} />
        <Separator borderColor="black10" />
      </React.Fragment>
    )
  }
  return (
    <ProvidePlaceholderContext>
      <PageWithSimpleHeader title={title}>
        {listHeader}
        <Flex mx={2}>
          <Spacer height={20} />
          <PlaceholderText height={24} width={100 + Math.random() * 50} />
          <Spacer height={10} />
          <Separator borderColor="black10" />
          {placeholderResults}
        </Flex>
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}
