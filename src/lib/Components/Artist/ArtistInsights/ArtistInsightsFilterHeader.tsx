import { ContextModule, OwnerType, tappedInfoBubble, TappedInfoBubbleArgs } from "@artsy/cohesion"
import { ArtworksFiltersStore } from 'lib/Components/ArtworkFilter/ArtworkFilterStore'
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { FilterIcon, Flex, Separator, Spacer, Text, TouchableHighlightColor } from "palette"
import React  from "react"
import { useTracking } from 'react-tracking'

interface ArtistInsightsFilterHeaderProps {
  onFilterPress: () => void
}

export const ArtistInsightsFilterHeader: React.FC<ArtistInsightsFilterHeaderProps> = (props) => {
  const { onFilterPress } = props
  const tracking = useTracking()
  const { width } = useScreenDimensions()
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  const renderAuctionResultsModal = () => (
    <>
      <Spacer my={1} />
      <Text>
        These auction results bring together sale data from top auction houses around the world, including
        Christie&rsquo;s, Sotheby&rsquo;s, Phillips and Bonhams. Results are updated daily.
      </Text>
      <Spacer mb={2} />
      <Text>
        Please note that the sale price includes the hammer price and buyer’s premium, as well as any other additional
        fees (e.g., Artist’s Resale Rights).
      </Text>
      <Spacer mb={2} />
    </>
  )

  return (
    <Flex backgroundColor="white100">
      <Flex py={2}>
        <Flex flexDirection="column">
          <InfoButton
            titleElement={
              <Text variant="subtitle" mr={0.5}>
                Auction Results
              </Text>
            }
            trackEvent={() => {
              tracking.trackEvent(tappedInfoBubble(tracks.tapAuctionResultsInfo()))
            }}
            modalTitle={"Auction Results"}
            maxModalHeight={310}
            modalContent={renderAuctionResultsModal()}
          />
          <Text variant="caption" color="black60" mt={0.3}>
            {counts.total} results
          </Text>
        </Flex>
        <TouchableHighlightColor
          haptic
          onPress={onFilterPress}
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center" mt={2}>
              <FilterIcon fill={color} width="20px" height="20px" ml={-0.5} />
              <Text variant="text" color={color}>
                Sort & Filter
              </Text>
            </Flex>
          )}
        />
      </Flex>
      <Separator ml={-2} width={width} />
    </Flex>
  )
}

export const tracks = {
  tapAuctionResultsInfo: (): TappedInfoBubbleArgs => ({
    contextModule: ContextModule.auctionResults,
    contextScreenOwnerType: OwnerType.artistAuctionResults,
    subject: "auctionResults",
  }),
}
