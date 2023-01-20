import { HomeUpcomingAuctionsRail_me$key } from "__generated__/HomeUpcomingAuctionsRail_me.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface HomeUpcomingAuctionsRailProps {
  me: HomeUpcomingAuctionsRail_me$key
  mb?: number
  title: string
}

export const HomeUpcomingAuctionsRail: React.FC<HomeUpcomingAuctionsRailProps> = ({
  me,
  mb,
  title,
}) => {
  const meRes = useFragment(meFragment, me)

  const { width: screenWidth } = useScreenDimensions()

  const filteredAuctionResults = extractNodes(meRes.upcomingAuctionResults).filter(
    (auctionResult) => auctionResult
  )

  if (!meRes?.upcomingAuctionResults || meRes?.upcomingAuctionResults?.totalCount === 0) {
    return null
  }
  return (
    <Flex mb={mb}>
      <Flex pl="2" pr="2">
        <SectionTitle
          title={title}
          onPress={() => {
            navigate("/upcoming-auction-results")
          }}
        />
      </Flex>
      <FlatList
        horizontal
        data={filteredAuctionResults}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={3}
        renderItem={({ item }) => (
          <AuctionResultListItemFragmentContainer
            showArtistName
            auctionResult={item}
            width={screenWidth * 0.9}
          />
        )}
      />
    </Flex>
  )
}

const meFragment = graphql`
  fragment HomeUpcomingAuctionsRail_me on Me {
    upcomingAuctionResults: auctionResultsByFollowedArtists(first: 10, state: UPCOMING) {
      totalCount
      edges {
        node {
          ...AuctionResultListItem_auctionResult
          internalID
        }
      }
    }
  }
`
