import { ContextModule } from "@artsy/cohesion"
import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { CityGuideEventGuides_query$key } from "__generated__/CityGuideEventGuides_query.graphql"
import { ProgressiveOnboardingCityGuide } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingCityGuide"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  FeaturedGuideItem,
  GuideListItem,
} from "app/Scenes/CityGuide/Components/CityGuideGuideListItem"
import { toGuideRows } from "app/Scenes/CityGuide/utils/toGuideRows"
import { PROGRESSIVE_ONBOARDING_CITY_GUIDE_CURATED_GUIDES } from "app/store/ProgressiveOnboardingModel"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MAX_GUIDES = 4

interface Props {
  citySlug: string
  query: CityGuideEventGuides_query$key | null | undefined
}

export const CityGuideEventGuides: React.FC<Props> = ({ citySlug, query: queryRef }) => {
  const { trackEvent } = useTracking()
  const query = useFragment(queryFragment, queryRef)

  const rows = toGuideRows(query?.itinerariesConnection)

  if (!rows.length) {
    return null
  }

  // The flagged guide leads the section whatever order the connection returned it in. With
  // none flagged, a lone guide leads by default; with several and none flagged, nothing is
  // promoted by position alone.
  const featuredRow = rows.find((row) => row.featured) ?? (rows.length === 1 ? rows[0] : undefined)
  const restRows = rows
    .filter((row) => row !== featuredRow)
    .slice(0, MAX_GUIDES - (featuredRow ? 1 : 0))
  const hasMore = rows.length > MAX_GUIDES

  return (
    <Flex backgroundColor="mono100" py={2}>
      <ProgressiveOnboardingCityGuide
        onboardingKey={PROGRESSIVE_ONBOARDING_CITY_GUIDE_CURATED_GUIDES}
        title="Expert-curated Guides"
        description="Click to discover our art picks in cities across the globe."
        placement="bottom"
        contextModule={ContextModule.cityGuideCard}
      >
        <SectionTitle
          variant="large"
          title="City Guides"
          titleColor="mono0"
          px={2}
          href={hasMore ? `/city-guide/${citySlug}/curated-guides` : undefined}
          onPress={
            hasMore
              ? () =>
                  trackEvent({
                    action_name: Schema.ActionNames.ViewAll,
                    action_type: Schema.ActionTypes.Tap,
                    owner_type: Schema.OwnerEntityTypes.CityGuide,
                    owner_slug: citySlug,
                    context_module: "cityGuideCard",
                  })
              : undefined
          }
        />
      </ProgressiveOnboardingCityGuide>

      <Flex testID="city-guides-list" px={2}>
        <Join separator={<Spacer y={2} />}>
          {!!featuredRow && (
            <FeaturedGuideItem key={featuredRow.id} item={featuredRow} citySlug={citySlug} />
          )}

          {restRows.map((item) => (
            <GuideListItem key={item.id} item={item} citySlug={citySlug} />
          ))}
        </Join>
      </Flex>
    </Flex>
  )
}

const queryFragment = graphql`
  fragment CityGuideEventGuides_query on Query
  @argumentDefinitions(citySlug: { type: "String!" }, first: { type: "Int!" }) {
    itinerariesConnection(citySlug: $citySlug, first: $first, isCurated: true) {
      edges {
        node {
          internalID
          slug
          title
          subtitle
          authorName
          featured
          visibility
          heroImage {
            url(version: "small")
            featuredUrl: url(version: "large")
          }
        }
      }
    }
  }
`
