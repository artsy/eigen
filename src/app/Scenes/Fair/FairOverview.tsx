import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Flex, Spacer, Spinner, Tabs, Text, useSpace } from "@artsy/palette-mobile"
import { FairOverviewQuery } from "__generated__/FairOverviewQuery.graphql"
import { FairOverview_fair$key } from "__generated__/FairOverview_fair.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { FairCollectionsFragmentContainer } from "app/Scenes/Fair/Components/FairCollections"
import { FairEditorialFragmentContainer } from "app/Scenes/Fair/Components/FairEditorial"
import { FairEmptyStateFragmentContainer } from "app/Scenes/Fair/Components/FairEmptyState"
import { FairFollowedArtistsRailFragmentContainer } from "app/Scenes/Fair/Components/FairFollowedArtistsRail"
import { FairTabError } from "app/Scenes/Fair/Components/FairTabError"
import { shouldShowLocationMap } from "app/Scenes/Fair/FairMoreInfo"
import { RouterLink } from "app/system/navigation/RouterLink"
import { truncatedTextLimit } from "app/utils/hardware"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { compact } from "lodash"
import { FC } from "react"
import { Platform } from "react-native"
import { useHeaderMeasurements } from "react-native-collapsible-tab-view"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface FairOverviewProps {
  fair: FairOverview_fair$key
}

export const FairOverview: FC<FairOverviewProps> = ({ fair }) => {
  const data = useFragment(fragment, fair)

  if (!data) {
    return null
  }

  const hasArticles = !!data.articlesConnection?.totalCount
  const hasCollections = !!data.marketingCollections.length
  const hasFollowedArtistArtworks = !!data.filterArtworksConnectionCounts?.counts?.total
  const previewText = data.summary || data.about
  // TOFIX: Must be a better way to determine if there is more info to show
  const canShowMoreInfoLink =
    !!previewText ||
    !!data.tagline ||
    !!data.location?.summary ||
    shouldShowLocationMap(data.location?.coordinates) ||
    !!data.ticketsLink ||
    !!data.hours ||
    !!data.links ||
    !!data.contact ||
    !!data.tickets

  const sections = compact([
    !!previewText && {
      key: "summary",
      content: (
        <Flex pt={2} px={2}>
          <ReadMore textStyle="new" content={previewText} maxChars={truncatedTextLimit()} />
        </Flex>
      ),
    },
    !!canShowMoreInfoLink && {
      key: "showMoreInfoLink",
      content: (
        <RouterLink to={`/fair/${data.slug}/info`}>
          <Flex pt={2} flexDirection="row" justifyContent="flex-start" alignItems="center" px={2}>
            <Text variant="sm">More info</Text>
            <ChevronSmallRightIcon mr="-5px" mt="4px" />
          </Flex>
        </RouterLink>
      ),
    },
    !!hasArticles && {
      key: "editorial",
      content: <FairEditorialFragmentContainer fair={data} />,
    },
    !!hasCollections && {
      key: "collections",
      content: <FairCollectionsFragmentContainer fair={data} />,
    },
    !!hasFollowedArtistArtworks && {
      key: "followedArtistArtworks",
      content: <FairFollowedArtistsRailFragmentContainer fair={data} />,
    },
  ])

  return (
    <Tabs.FlashList
      data={sections}
      renderItem={({ item }) => item.content}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      ListEmptyComponent={() => {
        return (
          <Flex pt={2}>
            <FairEmptyStateFragmentContainer fair={data} />
          </Flex>
        )
      }}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    />
  )
}

const fragment = graphql`
  fragment FairOverview_fair on Fair {
    ...FairEditorial_fair
    ...FairCollections_fair
    ...FairFollowedArtistsRail_fair
    ...FairEmptyState_fair

    isActive
    slug
    summary
    about
    tagline
    location {
      summary
      coordinates {
        lat
        lng
      }
    }
    ticketsLink
    hours(format: MARKDOWN)
    links(format: MARKDOWN)
    tickets(format: MARKDOWN)
    contact(format: MARKDOWN)
    articlesConnection(first: 1, sort: PUBLISHED_AT_DESC) {
      totalCount
    }
    marketingCollections(size: 5) {
      __typename
    }
    filterArtworksConnectionCounts: filterArtworksConnection(
      first: 1
      input: { includeArtworksByFollowedArtists: true }
    ) {
      counts {
        total
      }
    }
  }
`

export const fairOverviewQuery = graphql`
  query FairOverviewQuery($fairID: String!) {
    fair(id: $fairID) {
      ...FairOverview_fair
    }
  }
`

export const FairOverviewQueryRenderer: React.FC<{ fairID: string }> = withSuspense({
  Component: (props) => {
    const data = useLazyLoadQuery<FairOverviewQuery>(fairOverviewQuery, { fairID: props.fairID })

    if (!data.fair) {
      return null
    }

    return <FairOverview fair={data.fair} />
  },
  LoadingFallback: () => <FairOverviewPlaceholder />,
  ErrorFallback: (fallbackProps) => <FairTabError {...fallbackProps} />,
})

const FairOverviewPlaceholder: React.FC = () => {
  const space = useSpace()
  const { height } = useHeaderMeasurements()
  // Tabs.ScrollView paddingTop is not working on Android, so we need to set it manually
  const paddingTop = Platform.OS === "android" ? height + 80 : space(4)

  return (
    <Tabs.ScrollView
      contentContainerStyle={{ paddingHorizontal: 0, paddingTop, width: "100%" }}
      // Do not allow scrolling while the fair is loading because there is nothing to show
      scrollEnabled={false}
    >
      <Flex alignItems="center">
        <Spinner />
      </Flex>
    </Tabs.ScrollView>
  )
}
