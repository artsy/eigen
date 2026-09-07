import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { CityGuideCuratedListsQuery } from "__generated__/CityGuideCuratedListsQuery.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

const IMAGE_SIZE = 80
/** Editorial guides per city. Well above the handful a city actually has. */
const PAGE_SIZE = 10

interface CuratedList {
  id: string
  /** What `Query.itinerary` is addressed by: a published guide's slug, else its id. */
  itineraryId: string
  title: string
  authorName: string
  imageUrl: string
}

const ListItem = ({ item, citySlug }: { item: CuratedList; citySlug: string }) => {
  return (
    // No `hasChildTouchable`: that mode makes RouterLink render nothing itself and clone
    // onPress onto its child (RouterLink.tsx:92-99). The child here is a styled View, which
    // ignores onPress, so the row would not be pressable at all. Without the prop,
    // RouterLink renders its own Touchable (RouterLink.tsx:103) and carries the testID.
    <RouterLink
      testID="curated-list-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
    >
      <Flex flexDirection="row" gap={1}>
        <RNImage
          src={item.imageUrl}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <Flex flex={1}>
          <Text variant="lg-display" color="mono0">
            {item.title}
          </Text>
          <Text variant="xs" color="mono0">
            By {item.authorName}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const CuratedLists = ({ citySlug }: { citySlug: string }) => {
  console.log("citySlug", citySlug)

  const data = useLazyLoadQuery<CityGuideCuratedListsQuery>(Query, { citySlug, first: PAGE_SIZE })

  const rows: CuratedList[] = extractNodes(data.itinerariesConnection).map((itinerary) => ({
    id: itinerary.internalID,
    // A curated guide is published and so has a slug; falling back to the id keeps an
    // unpublished one reachable rather than linking nowhere.
    itineraryId: itinerary.slug ?? itinerary.internalID,
    title: itinerary.name,
    authorName: itinerary.authorName ?? "",
    imageUrl: itinerary.heroImage?.resized?.url ?? itinerary.heroImage?.url ?? "",
  }))

  // Cities without curated guides render nothing at all rather than an empty dark band.
  if (!rows.length) {
    return null
  }

  return (
    <Flex px={2} backgroundColor="mono100" pb={2}>
      <Join separator={<Spacer y={2} />}>
        {rows.map((item) => (
          <ListItem key={item.id} item={item} citySlug={citySlug} />
        ))}
      </Join>
    </Flex>
  )
}

const Query = graphql`
  query CityGuideCuratedListsQuery($citySlug: String!, $first: Int!) {
    itinerariesConnection(citySlug: $citySlug, isCurated: true, first: $first) {
      edges {
        node {
          internalID
          slug
          name
          authorName
          heroImage {
            resized(width: 240) {
              url
            }
            url
          }
        }
      }
    }
  }
`

export const CityGuideCuratedLists = withSuspense({
  Component: CuratedLists,
  // The section sits mid-scroll on the City Guide home, so it stays absent until it has
  // rows rather than reserving space for a spinner and shifting everything below it.
  // `withSuspense` only accepts `NoFallback` for the error slot, so the loading one is an
  // explicit empty component.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
