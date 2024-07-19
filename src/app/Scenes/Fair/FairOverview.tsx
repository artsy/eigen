import { ChevronIcon, Flex, Tabs, Text, Touchable } from "@artsy/palette-mobile"
import { FairOverview_fair$key } from "__generated__/FairOverview_fair.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { FairCollectionsFragmentContainer } from "app/Scenes/Fair/Components/FairCollections"
import { FairEditorialFragmentContainer } from "app/Scenes/Fair/Components/FairEditorial"
import { FairEmptyStateFragmentContainer } from "app/Scenes/Fair/Components/FairEmptyState"
import { FairFollowedArtistsRailFragmentContainer } from "app/Scenes/Fair/Components/FairFollowedArtistsRail"
import { shouldShowLocationMap } from "app/Scenes/Fair/FairMoreInfo"
import { navigate } from "app/system/navigation/navigate"
import { truncatedTextLimit } from "app/utils/hardware"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

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
  const hasFollowedArtistArtworks = !!data.filterArtworksConnection?.edges?.length
  const hasPreviewText = data.summary || data.about
  // TOFIX: Must be a better way to determine if there is more info to show
  const canShowMoreInfoLink =
    !!data.about ||
    !!data.tagline ||
    !!data.location?.summary ||
    shouldShowLocationMap(data.location?.coordinates) ||
    !!data.ticketsLink ||
    !!data.hours ||
    !!data.links ||
    !!data.contact ||
    !!data.summary ||
    !!data.tickets

  return (
    <Tabs.ScrollView style={{ paddingVertical: 20 }}>
      {!!hasPreviewText && (
        <ReadMore textStyle="new" content={hasPreviewText} maxChars={truncatedTextLimit()} />
      )}
      {!!canShowMoreInfoLink && (
        <Touchable onPress={() => navigate(`/fair/${data.slug}/info`)}>
          <Flex pt={2} flexDirection="row" justifyContent="flex-start" alignItems="center">
            <Text variant="sm">More info</Text>
            <ChevronIcon mr="-5px" mt="4px" />
          </Flex>
        </Touchable>
      )}

      {!!data.isActive ? (
        <>
          {!!hasArticles && <FairEditorialFragmentContainer fair={data} />}
          {!!hasCollections && <FairCollectionsFragmentContainer fair={data} />}
          {!!hasFollowedArtistArtworks && <FairFollowedArtistsRailFragmentContainer fair={data} />}
        </>
      ) : (
        <>
          <FairEmptyStateFragmentContainer fair={data} />
          {!!hasArticles ? (
            <FairEditorialFragmentContainer fair={data} />
          ) : (
            <FairEmptyStateFragmentContainer fair={data} />
          )}
        </>
      )}
    </Tabs.ScrollView>
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
    filterArtworksConnection(first: 20, input: { includeArtworksByFollowedArtists: true }) {
      edges {
        __typename
      }
    }
  }
`
