import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionAuctionResultsQuery } from "__generated__/HomeViewSectionAuctionResultsQuery.graphql"
import { HomeViewSectionAuctionResults_section$key } from "__generated__/HomeViewSectionAuctionResults_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import {
  AUCTION_RESULT_CARD_IMAGE_HEIGHT,
  AUCTION_RESULT_CARD_IMAGE_WIDTH,
  AuctionResultListItemFragmentContainer,
} from "app/Components/Lists/AuctionResultListItem"
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
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { Dimensions, FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionAuctionResultsProps {
  section: HomeViewSectionAuctionResults_section$key
}

// Avoid the card width to be too wide on tablets
const AUCTION_RESULT_CARD_WIDTH = Math.min(400, Dimensions.get("window").width * 0.9)

export const HomeViewSectionAuctionResults: React.FC<HomeViewSectionAuctionResultsProps> = (
  props
) => {
  const section = useFragment(sectionFragment, props.section)
  const tracking = useHomeViewTracking()

  if (!section || !section.auctionResultsConnection?.totalCount) {
    return null
  }

  const auctionResults = extractNodes(section.auctionResultsConnection)
  const viewAll = section.component?.behaviors?.viewAll

  const onSectionViewAll = () => {
    tracking.tappedAuctionResultGroupViewAll(
      section.contextModule as ContextModule,
      OwnerType.auctionResultsForArtistsYouFollow
    )

    if (viewAll?.href) {
      navigate(viewAll.href)
    } else {
      navigate(`/section/${section.internalID}`, {
        passProps: {
          sectionType: section.__typename,
        },
      })
    }
  }

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex px={2}>
        <SectionTitle
          title={section.component?.title ?? "Auction Results"}
          onPress={viewAll ? onSectionViewAll : undefined}
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
              width={AUCTION_RESULT_CARD_WIDTH}
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
          viewAll ? (
            <BrowseMoreRailCard onPress={onSectionViewAll} text="Browse All Results" />
          ) : undefined
        }
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment HomeViewSectionAuctionResults_section on HomeViewSectionAuctionResults {
    __typename
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

const HomeViewSectionAuctionResultsPlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex mx={2} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
        <SkeletonText variant="lg-display">List of Auction Results</SkeletonText>

        <Spacer y={1} />

        <Flex flexDirection="row">
          <Join separator={<Spacer x="15px" />}>
            {times(3 + randomValue * 10).map((index) => (
              <Flex
                key={index}
                maxWidth={AUCTION_RESULT_CARD_WIDTH}
                flexDirection="row"
                overflow="hidden"
              >
                <SkeletonBox
                  key={index}
                  height={AUCTION_RESULT_CARD_IMAGE_HEIGHT}
                  width={AUCTION_RESULT_CARD_IMAGE_WIDTH}
                />
                <Spacer x={1} />
                <Flex>
                  <SkeletonText variant="xs">Katherine Bernhardt</SkeletonText>
                  <SkeletonText variant="xs">Shower Power</SkeletonText>
                  <SkeletonText variant="xs" numberOfLines={2}>
                    Unique lithograph in colors, on somerset tub sized paper, the full sheet.
                  </SkeletonText>
                  <SkeletonText variant="xs" numberOfLines={1} mt={1}>
                    Set 11, 2024 - Phillips
                  </SkeletonText>
                  <SkeletonText variant="xs" numberOfLines={1}>
                    $10,000
                  </SkeletonText>
                </Flex>
              </Flex>
            ))}
          </Join>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

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
}, HomeViewSectionAuctionResultsPlaceholder)
