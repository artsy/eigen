import { AuctionResultListItem_auctionResult } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Separator, Spacer, Text } from "palette"
import React, { useState } from "react"
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SectionList,
  SectionListData,
} from "react-native"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"
import { AuctionResultListItemFragmentContainer } from "./Lists/AuctionResultListItem"
import Spinner from "./Spinner"

interface SectionT {
  [key: string]: any
}
type ItemT = any // TODO: ><'

interface AuctionResultListProps {
  header: string
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>
  refreshing: boolean
  handleRefresh: () => void
  onEndReached: () => void
  ListHeaderComponent: React.ReactElement
  onItemPress: (item: AuctionResultListItem_auctionResult) => void
  isLoadingNext: boolean
}

export const AuctionResulstList: React.FC<AuctionResultListProps> = (props) => {
  const {
    header,
    sections,
    refreshing,
    handleRefresh,
    onEndReached,
    ListHeaderComponent,
    onItemPress,
    isLoadingNext,
  } = props
  const [showHeader, setShowHeader] = useState<boolean>(false)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowHeader(event.nativeEvent.contentOffset.y > 40)
  }

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <FancyModalHeader hideBottomDivider>{!!showHeader && header}</FancyModalHeader>
      <SectionList
        testID="Results_Section_List"
        onScroll={(event) => handleScroll(event)}
        sections={sections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.internalID}
        stickySectionHeadersEnabled
        ListHeaderComponent={ListHeaderComponent}
        renderSectionHeader={({ section: { sectionTitle } }) => (
          <Flex mx="2">
            <Text variant="md">{sectionTitle}</Text>
          </Flex>
        )}
        renderItem={({ item }) =>
          item ? (
            <Flex>
              <AuctionResultListItemFragmentContainer
                auctionResult={item}
                showArtistName
                onPress={() => onItemPress(item)}
              />
            </Flex>
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

export const LoadingSkeleton: React.FC<{ listHeader: React.ReactElement }> = ({ listHeader }) => {
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
    <>
      <FancyModalHeader hideBottomDivider />
      {listHeader}
      <Flex mx={2}>
        <Spacer height={20} />
        <Separator borderColor="black10" />
        {placeholderResults}
      </Flex>
    </>
  )
}
