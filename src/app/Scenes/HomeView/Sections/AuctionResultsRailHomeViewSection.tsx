import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { AuctionResultsRailHomeViewSection_section$key } from "__generated__/AuctionResultsRailHomeViewSection_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
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
  const componentHref = section.component?.behaviors?.viewAll?.href

  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle
          title={section.component?.title ?? "Auction Results"}
          onPress={componentHref ? () => navigate(componentHref) : undefined}
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
          componentHref ? (
            <BrowseMoreRailCard
              onPress={() => {
                navigate(componentHref)
              }}
              text="Browse All Results"
            />
          ) : undefined
        }
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment AuctionResultsRailHomeViewSection_section on AuctionResultsRailHomeViewSection {
    component {
      title
      behaviors {
        viewAll {
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
