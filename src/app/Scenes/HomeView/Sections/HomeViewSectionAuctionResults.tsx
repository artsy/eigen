import { ContextModule } from "@artsy/cohesion"
import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { HomeViewSectionAuctionResultsQuery } from "__generated__/HomeViewSectionAuctionResultsQuery.graphql"
import { HomeViewSectionAuctionResults_section$key } from "__generated__/HomeViewSectionAuctionResults_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionAuctionResultsProps {
  section: HomeViewSectionAuctionResults_section$key
}

export const HomeViewSectionAuctionResults: React.FC<HomeViewSectionAuctionResultsProps> = (
  props
) => {
  const section = useFragment(sectionFragment, props.section)
  const { width: screenWidth } = useScreenDimensions()
  const tracking = useHomeViewTracking()

  if (!section || !section.auctionResultsConnection?.totalCount) {
    return null
  }

  const auctionResults = extractNodes(section.auctionResultsConnection)
  const componentHref = section.component?.behaviors?.viewAll?.href

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex px={2}>
        <SectionTitle
          title={section.component?.title ?? "Auction Results"}
          onPress={componentHref ? () => navigate(componentHref) : undefined}
        />
      </Flex>
      <FlatList
        horizontal
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        data={auctionResults}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <AuctionResultListItemFragmentContainer
              showArtistName
              auctionResult={item}
              width={screenWidth * 0.9}
              onTrack={() => {
                tracking.tappedAuctionResultGroup(
                  item.internalID,
                  item.slug,
                  section.contextModule as ContextModule,
                  index
                )
              }}
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
    contextModule
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

const homeViewSectionAuctionResultsQuery = graphql`
  query HomeViewSectionAuctionResultsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionAuctionResults_section
      }
    }
  }
`

export const HomeViewSectionAuctionResultsQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionAuctionResultsQuery>(
    homeViewSectionAuctionResultsQuery,
    {
      id: props.sectionID,
    }
  )

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionAuctionResults section={data.homeView.section} />
})
