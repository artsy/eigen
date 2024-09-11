import { ActionType, ContextModule, OwnerType, TappedEntityGroup } from "@artsy/cohesion"
import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { HomeViewSectionAuctionResults_section$key } from "__generated__/HomeViewSectionAuctionResults_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionAuctionResultsProps {
  section: HomeViewSectionAuctionResults_section$key
}

export const HomeViewSectionAuctionResults: React.FC<HomeViewSectionAuctionResultsProps> = (
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
        renderItem={({ item, index }) => {
          return (
            <AuctionResultListItemFragmentContainer
              showArtistName
              auctionResult={item}
              width={screenWidth * 0.9}
              trackingEventPayload={tracks.tappedAuctionResultGroup({
                auctionResultID: item.internalID,
                auctionResultSlug: item.slug ?? "",
                index,
                sectionID: section.internalID,
              })}
            />
          )
        }}
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
  fragment HomeViewSectionAuctionResults_section on HomeViewSectionAuctionResults {
    internalID
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
          slug
          ...AuctionResultListItem_auctionResult
        }
      }
    }
  }
`

const tracks = {
  tappedAuctionResultGroup: ({
    auctionResultID,
    auctionResultSlug,
    index,
    sectionID,
  }: {
    auctionResultID: string
    auctionResultSlug: string
    index: number
    sectionID: string
  }): TappedEntityGroup => {
    return {
      action: ActionType.tappedAuctionResultGroup,
      context_module: sectionID as ContextModule,
      context_screen_owner_type: OwnerType.home,
      destination_screen_owner_id: auctionResultID,
      destination_screen_owner_slug: auctionResultSlug,
      destination_screen_owner_type: OwnerType.auctionResult,
      horizontal_slide_position: index,
      type: "thumbnail",
    }
  },
}
