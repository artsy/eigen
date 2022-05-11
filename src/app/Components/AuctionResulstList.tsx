import { AuctionResultListItem_auctionResult } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Text } from "palette"
import React, { useState } from "react"
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SectionList,
  SectionListData,
} from "react-native"
import { Flex } from "./Bidding/Elements/Flex"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"
import { ListHeader } from "./ListHeader"
import { AuctionResultListItemFragmentContainer } from "./Lists/AuctionResultListItem"
import Spinner from "./Spinner"

interface SectionT {
  [key: string]: any
}
type ItemT = any // TODO: ><'

interface AuctionResultListProps {
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>
  refreshing: boolean
  handleRefresh: () => void
  onEndReached: () => void
  onItemPress: (item: AuctionResultListItem_auctionResult) => void
  isLoadingNext: boolean
}

export const AuctionResulstList: React.FC<AuctionResultListProps> = (props) => {
  const { sections, refreshing, handleRefresh, onEndReached, onItemPress, isLoadingNext } = props
  const [showHeader, setShowHeader] = useState<boolean>(false)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowHeader(event.nativeEvent.contentOffset.y > 40)
  }

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <FancyModalHeader hideBottomDivider>{!!showHeader && "Auction Results"} </FancyModalHeader>
      <SectionList
        testID="Results_Section_List"
        onScroll={(event) => handleScroll(event)}
        sections={sections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.internalID}
        stickySectionHeadersEnabled
        ListHeaderComponent={() => {
          return (
            <ListHeader
              title="Auction Results"
              subtitle="The latest auction results for the artists you collect."
            />
          )
        }}
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
