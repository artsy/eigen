import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { AuctionResultsRailHomeViewSection_section$key } from "__generated__/AuctionResultsRailHomeViewSection_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface AuctionResultsRailHomeViewSectionProps {
  section: AuctionResultsRailHomeViewSection_section$key
}

export const AuctionResultsRailHomeViewSection: React.FC<AuctionResultsRailHomeViewSectionProps> = (
  props
) => {
  const section = useFragment(sectionFragment, props.section)
  const { width: screenWidth } = useScreenDimensions()

  if (!section || !section.auctionResultsConnection?.totalCount) {
    return null
  }

  const auctionResults = extractNodes(section.auctionResultsConnection)

  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle
          title={section.component?.title ?? "Auction Results"}
          onPress={() => {
            // TODO: navigate to Auction Results screen using section.component?.href
          }}
        />
      </Flex>
      <FlatList
        horizontal
        data={auctionResults}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={3}
        renderItem={({ item }) => (
          <AuctionResultListItemFragmentContainer
            showArtistName
            auctionResult={item}
            width={screenWidth * 0.9}
          />
        )}
        keyExtractor={(item) => item.internalID}
        ListFooterComponent={
          <BrowseMoreRailCard
            onPress={() => {
              // TODO: navigate to Auction Results screen using section.component?.behaviors.viewAll.href
            }}
            text={section.component?.behaviors?.viewAll?.buttonText ?? "Browse All Results"}
          />
        }
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment AuctionResultsRailHomeViewSection_section on AuctionResultsRailHomeViewSection {
    component {
      title
      href
      behaviors {
        viewAll {
          buttonText
          href
        }
      }
    }
    auctionResultsConnection(first: 10) {
      totalCount
      edges {
        node {
          internalID
          ...AuctionResultListItem_auctionResult
        }
      }
    }
  }
`
