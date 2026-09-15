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
  CityGuideEventGuidesQuery,
  CityGuideEventGuidesQuery$data,
} from "__generated__/CityGuideEventGuidesQuery.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { cityGuideEventDateRange } from "app/Scenes/CityGuide/utils/cityGuideEventDateRange"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

const IMAGE_SIZE = 70
const HERO_HEIGHT = 198
const PAGE_SIZE = 10
const NO_ICON_SIZE = 24
const HERO_NO_ICON_SIZE = 40

type CityGuideEventsConnection = NonNullable<
  CityGuideEventGuidesQuery$data["city"]
>["cityGuideEventsConnection"]

type CityGuideEventEdge = NonNullable<
  NonNullable<NonNullable<CityGuideEventsConnection>["edges"]>[number]
>

type CityGuideEventNode = NonNullable<CityGuideEventEdge["node"]>

interface GuideRow {
  id: string
  /** What `Query.itinerary` is addressed by: a published guide's slug, else its id. */
  itineraryId: string
  title: string
  authorName: string
  imageUrl: string
}

const GuideListItem = ({ item, citySlug }: { item: GuideRow; citySlug: string }) => {
  return (
    // No `hasChildTouchable`: that mode makes RouterLink render nothing itself and clone
    // onPress onto its child (RouterLink.tsx:92-99). The child here is a styled View, which
    // ignores onPress, so the row would not be pressable at all. Without the prop,
    // RouterLink renders its own Touchable (RouterLink.tsx:103) and carries the testID.
    <RouterLink
      testID="event-guide-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
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

const EventGuides = ({ citySlug }: { citySlug: string }) => {
  const data = useLazyLoadQuery<CityGuideEventGuidesQuery>(Query, { citySlug, first: PAGE_SIZE })

  const events = extractNodes(data.city?.cityGuideEventsConnection)

  // Cities without a current city guide event render nothing at all rather than an empty
  // dark band.
  if (!events.length) {
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
    </Flex>
  )
}

const Query = graphql`
  query CityGuideEventGuidesQuery($citySlug: String!, $first: Int!) {
    city(slug: $citySlug) {
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
  }
`

export const CityGuideEventGuides = withSuspense({
  Component: EventGuides,
  // The section sits mid-scroll on the City Guide home, so it stays absent until it has
  // rows rather than reserving space for a spinner and shifting everything below it.
  // `withSuspense` only accepts `NoFallback` for the error slot, so the loading one is an
  // explicit empty component.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
