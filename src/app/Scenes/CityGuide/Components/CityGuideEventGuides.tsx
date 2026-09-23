import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NoArtIcon } from "@artsy/icons/native"
import {
  Flex,
  Image,
  Join,
  Spacer,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { CityGuideEventGuides_query$key } from "__generated__/CityGuideEventGuides_query.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const IMAGE_SIZE = 70
const FEATURED_HEIGHT = 198
const NO_ICON_SIZE = 24
const FEATURED_NO_ICON_SIZE = 40

interface GuideRow {
  id: string
  /** What `Query.itinerary` is addressed by: a published guide's slug, else its id. */
  itineraryId: string
  internalID: string
  slug: string | null
  title: string
  subtitle: string
  authorName: string
  imageUrl: string
  /** Same image at a size that holds up across the full width of the featured item. */
  featuredImageUrl: string
  /** Set editorially in Gravity. The one guide that leads the section, opened up large. */
  featured: boolean
}

const GuideListItem = ({ item, citySlug }: { item: GuideRow; citySlug: string }) => {
  const { trackEvent } = useTracking()

  return (
    // No `hasChildTouchable`: that mode makes RouterLink render nothing itself and clone
    // onPress onto its child (RouterLink.tsx:92-99). The child here is a styled View, which
    // ignores onPress, so the row would not be pressable at all. Without the prop,
    // RouterLink renders its own Touchable (RouterLink.tsx:103) and carries the testID.
    <RouterLink
      testID="event-guide-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
      onPress={() => trackEvent(tracks.tappedGuide(citySlug, item.internalID, item.slug))}
    >
      <Flex flexDirection="row" gap={1}>
        {item.imageUrl ? (
          <Image
            testID="event-guide-image"
            src={item.imageUrl}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            resizeMode="cover"
          />
        ) : (
          <Flex
            testID="event-guide-no-image"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            backgroundColor="mono10"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
          </Flex>
        )}

        <Flex flex={1}>
          <Text variant="md" color="mono0">
            {item.title}
          </Text>
          {!!item.subtitle && (
            <Text variant="xs" color="mono10">
              {item.subtitle}
            </Text>
          )}
          {!!item.authorName && (
            <Text variant="xs" color="mono10">
              By {item.authorName}
            </Text>
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}

/** The lead guide: the same row, opened up to a full-width image with its text underneath. */
const FeaturedGuideItem = ({ item, citySlug }: { item: GuideRow; citySlug: string }) => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const imageWidth = screenWidth - 2 * space(2)
  const { trackEvent } = useTracking()

  return (
    <RouterLink
      testID="event-guide-featured"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
      onPress={() => trackEvent(tracks.tappedGuide(citySlug, item.internalID, item.slug))}
    >
      {item.featuredImageUrl ? (
        <Image
          testID="event-guide-featured-image"
          src={item.featuredImageUrl}
          width={imageWidth}
          height={FEATURED_HEIGHT}
          resizeMode="cover"
        />
      ) : (
        <Flex
          testID="event-guide-featured-no-image"
          width={imageWidth}
          height={FEATURED_HEIGHT}
          backgroundColor="mono10"
          alignItems="center"
          justifyContent="center"
        >
          <NoArtIcon width={FEATURED_NO_ICON_SIZE} height={FEATURED_NO_ICON_SIZE} fill="mono60" />
        </Flex>
      )}

      <Spacer y={1} />

      <Text variant="md" color="mono0">
        {item.title}
      </Text>
      {!!item.subtitle && (
        <Text variant="xs" color="mono10">
          {item.subtitle}
        </Text>
      )}
      {!!item.authorName && (
        <Text variant="xs" color="mono10">
          By {item.authorName}
        </Text>
      )}
    </RouterLink>
  )
}

interface Props {
  citySlug: string
  query: CityGuideEventGuides_query$key | null | undefined
}

export const CityGuideEventGuides: React.FC<Props> = ({ citySlug, query: queryRef }) => {
  const query = useFragment(queryFragment, queryRef)

  /*
    Filtered to this city by Gravity: a city's curated guides stand on their own and do not
    depend on an event being on right now. Gravity's endpoint also returns the requesting
    editor's own drafts, so drop anything not published before it reaches the app.
  */
  const rows: GuideRow[] = extractNodes(query?.itinerariesConnection)
    .filter((itinerary) => itinerary.visibility === "PUBLIC")
    .map((itinerary) => ({
      id: itinerary.internalID,
      itineraryId: itinerary.slug ?? itinerary.internalID,
      internalID: itinerary.internalID,
      slug: itinerary.slug ?? null,
      title: itinerary.title,
      subtitle: itinerary.subtitle ?? "",
      authorName: itinerary.authorName ?? "",
      imageUrl: itinerary.heroImage?.url ?? "",
      featuredImageUrl: itinerary.heroImage?.featuredUrl ?? "",
      featured: itinerary.featured,
    }))

  if (!rows.length) {
    return null
  }

  // The flagged guide leads the section whatever order the connection returned it in. With
  // none flagged, a lone guide leads by default; with several and none flagged, nothing is
  // promoted by position alone.
  const featuredRow = rows.find((row) => row.featured) ?? (rows.length === 1 ? rows[0] : undefined)
  const restRows = rows.filter((row) => row !== featuredRow)

  return (
    <Flex backgroundColor="mono100" py={2}>
      {/* Static heading, unlike the other sections' SectionTitle: no chevron, no tap target. */}
      <SectionTitle variant="large" title="City Guides" titleColor="mono0" px={2} />

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

const tracks = {
  tappedGuide: (citySlug: string, guideId: string, slug: string | null) => ({
    action: ActionType.tappedExploreGroup,
    context_module: ContextModule.cityGuideCard,
    context_screen_owner_type: OwnerType.cityGuide,
    context_screen_owner_slug: citySlug,
    destination_screen_owner_type: OwnerType.cityGuideGuide,
    destination_screen_owner_id: guideId,
    ...(slug ? { destination_screen_owner_slug: slug } : {}),
  }),
}
