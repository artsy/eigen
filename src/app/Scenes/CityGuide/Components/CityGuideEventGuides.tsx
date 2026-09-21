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
import {
  CityGuideEventGuides_city$data,
  CityGuideEventGuides_city$key,
} from "__generated__/CityGuideEventGuides_city.graphql"
import { CityGuideEventGuides_query$key } from "__generated__/CityGuideEventGuides_query.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { cityGuideEventDateRange } from "app/Scenes/CityGuide/utils/cityGuideEventDateRange"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const IMAGE_SIZE = 70
const HERO_HEIGHT = 198
const NO_ICON_SIZE = 24
const HERO_NO_ICON_SIZE = 40

type CityGuideEventsConnection =
  NonNullable<CityGuideEventGuides_city$data>["cityGuideEventsConnection"]

type CityGuideEventEdge = NonNullable<
  NonNullable<NonNullable<CityGuideEventsConnection>["edges"]>[number]
>

type CityGuideEventNode = NonNullable<CityGuideEventEdge["node"]>

interface GuideRow {
  id: string
  /** What `Query.itinerary` is addressed by: a published guide's slug, else its id. */
  itineraryId: string
  internalID: string
  slug: string | null
  title: string
  authorName: string
  imageUrl: string
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
          <Text variant="xs" color="mono10">
            By {item.authorName}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

/** Only the guides link out — the event itself is a heading, not a tap target. */
const EventGroup = ({ event, citySlug }: { event: CityGuideEventNode; citySlug: string }) => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  // The join row's own position, not the order the connection happened to return — the
  // attachments are reorderable server-side (Gravity), so this can't be assumed stable.
  const rows: GuideRow[] = [...event.itineraries]
    .sort((a, b) => a.position - b.position)
    .map((attachment) => ({
      id: attachment.internalID,
      itineraryId: attachment.itinerary.slug ?? attachment.itinerary.internalID,
      internalID: attachment.itinerary.internalID,
      slug: attachment.itinerary.slug ?? null,
      title: attachment.itinerary.title,
      authorName: attachment.itinerary.authorName ?? "",
      imageUrl: attachment.itinerary.heroImage?.url ?? "",
    }))

  if (!rows.length) {
    return null
  }

  return (
    <Flex testID="event-guide-group" px={2}>
      {event.heroImage?.url ? (
        <Image
          testID="event-guide-hero-image"
          src={event.heroImage.url}
          height={HERO_HEIGHT}
          width={screenWidth - 2 * space(2)}
          resizeMode="cover"
        />
      ) : (
        <Flex
          testID="event-guide-hero-no-image"
          height={HERO_HEIGHT}
          backgroundColor="mono90"
          alignItems="center"
          justifyContent="center"
        >
          <NoArtIcon width={HERO_NO_ICON_SIZE} height={HERO_NO_ICON_SIZE} fill="mono60" />
        </Flex>
      )}

      <Spacer y={2} />

      <Text variant="lg-display" color="mono0">
        {event.title}
      </Text>

      {!!event.subtitle && (
        <Text variant="xs" color="mono10">
          {event.subtitle}
        </Text>
      )}

      <Text variant="xs" color="mono10">
        {cityGuideEventDateRange(event.startAt, event.endAt)}
      </Text>

      <Spacer y={2} />

      <Join separator={<Spacer y={2} />}>
        {rows.map((item) => (
          <GuideListItem key={item.id} item={item} citySlug={citySlug} />
        ))}
      </Join>
    </Flex>
  )
}

/** The city's curated itineraries that aren't already attached to one of the events above. */
const OtherCuratedGuides = ({
  rows,
  citySlug,
  withTopSpacer,
}: {
  rows: GuideRow[]
  citySlug: string
  /** Separates these from the event above. Off when they follow the heading directly. */
  withTopSpacer: boolean
}) => {
  if (!rows.length) {
    return null
  }

  return (
    <>
      {!!withTopSpacer && <Spacer y={2} />}

      <Flex testID="city-other-guides" px={2}>
        <Join separator={<Spacer y={2} />}>
          {rows.map((item) => (
            <GuideListItem key={item.id} item={item} citySlug={citySlug} />
          ))}
        </Join>
      </Flex>
    </>
  )
}

interface Props {
  citySlug: string
  city: CityGuideEventGuides_city$key | null | undefined
  query: CityGuideEventGuides_query$key | null | undefined
}

export const CityGuideEventGuides: React.FC<Props> = ({
  citySlug,
  city: cityRef,
  query: queryRef,
}) => {
  const city = useFragment(cityFragment, cityRef)
  const query = useFragment(queryFragment, queryRef)

  const events = extractNodes(city?.cityGuideEventsConnection)

  // Itineraries already shown in an event group above don't repeat in the city-wide list.
  const attachedItineraryIds = new Set(
    events.flatMap((event) =>
      event.itineraries.map((attachment) => attachment.itinerary.internalID)
    )
  )

  /*
    A separate query from the events above, filtered to this city by Gravity: a city's
    curated guides stand on their own and do not depend on an event being on right now.
  */
  const otherCuratedRows: GuideRow[] = extractNodes(query?.itinerariesConnection)
    .filter((itinerary) => !attachedItineraryIds.has(itinerary.internalID))
    .map((itinerary) => ({
      id: itinerary.internalID,
      itineraryId: itinerary.slug ?? itinerary.internalID,
      internalID: itinerary.internalID,
      slug: itinerary.slug ?? null,
      title: itinerary.title,
      authorName: itinerary.authorName ?? "",
      imageUrl: itinerary.heroImage?.url ?? "",
    }))

  /*
    Only an entirely empty section disappears. Checked after the guides are gathered, not
    on the events alone: between events a city still has its curated guides, and bailing on
    `events.length` alone hid them for the whole gap.
  */
  if (!events.length && !otherCuratedRows.length) {
    return null
  }

  return (
    <Flex backgroundColor="mono100" py={2}>
      {/* Static heading, unlike the other sections' SectionTitle: no chevron, no tap target. */}
      <SectionTitle variant="large" title="Curated City Guides" titleColor="mono0" px={2} />

      <Join separator={<Spacer y={4} />}>
        {events.map((event) => (
          <EventGroup key={event.internalID} event={event} citySlug={citySlug} />
        ))}
      </Join>

      <OtherCuratedGuides
        rows={otherCuratedRows}
        citySlug={citySlug}
        withTopSpacer={events.length > 0}
      />
    </Flex>
  )
}

const cityFragment = graphql`
  fragment CityGuideEventGuides_city on City @argumentDefinitions(first: { type: "Int!" }) {
    cityGuideEventsConnection(first: $first, status: CURRENT) {
      edges {
        node {
          internalID
          title
          subtitle
          startAt
          endAt
          heroImage {
            url(version: "large")
          }
          itineraries {
            internalID
            position
            itinerary {
              internalID
              slug
              title
              authorName
              heroImage {
                url(version: "small")
              }
            }
          }
        }
      }
    }
  }
`

const queryFragment = graphql`
  fragment CityGuideEventGuides_query on Query
  @argumentDefinitions(citySlug: { type: "String!" }, first: { type: "Int!" }) {
    itinerariesConnection(citySlug: $citySlug, first: $first, isCurated: true) {
      edges {
        node {
          internalID
          slug
          title
          authorName
          heroImage {
            url(version: "small")
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
