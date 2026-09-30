import { Flex, Image, Text } from "@artsy/palette-mobile"
import { ItineraryHeader_itinerary$key } from "__generated__/ItineraryHeader_itinerary.graphql"
import { useItineraryLocalCover } from "app/Scenes/CityGuide/hooks/useItineraryLocalCover"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"

const HERO_HEIGHT = 300

interface Props {
  itinerary: ItineraryHeader_itinerary$key
  /**
   * The floating back button sits over this header, absolutely positioned outside the
   * scroll view. A hero image is tall enough that its title clears it either way; with no
   * hero the title would otherwise render right under the button.
   */
  topInset: number
  /** Change it to re-read a cover just saved from the edit sheet. */
  localCoverRefreshKey?: unknown
}

export const ItineraryHeader: React.FC<Props> = ({
  itinerary: itineraryRef,
  topInset,
  localCoverRefreshKey,
}) => {
  const itinerary = useFragment(fragment, itineraryRef)
  const heroImage = itinerary.heroImage
  const localCover = useItineraryLocalCover(itinerary.internalID, localCoverRefreshKey)
  const heroUrl = localCover?.path ?? heroImage?.url
  const personalLabel = itinerary.isMine
    ? "Your Itinerary"
    : itinerary.authorName?.trim()
      ? `Created by ${itinerary.authorName.trim()}`
      : "Shared Itinerary"

  return (
    <Flex>
      {heroUrl ? (
        <Flex height={HERO_HEIGHT} justifyContent="flex-end">
          <Flex style={{ position: "absolute", width: "100%", height: HERO_HEIGHT }}>
            <Image
              testID="itinerary-hero-image"
              src={heroUrl}
              performResize={!localCover}
              blurhash={localCover ? null : heroImage?.blurhash}
              aspectRatio={localCover?.aspectRatio ?? heroImage?.aspectRatio}
              resizeMode="cover"
              style={{ width: "100%", height: HERO_HEIGHT }}
            />
          </Flex>

          <LinearGradient
            testID="itinerary-hero-scrim"
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{ position: "absolute", bottom: 0, width: "100%", height: HERO_HEIGHT / 2 }}
          />

          <Flex p={2}>
            {/* Personal itineraries identify their owner; curated guides have a byline below. */}
            {!itinerary.isCurated && (
              <Text variant="xs" color="white">
                {personalLabel}
              </Text>
            )}

            <Text variant="xl" color="white">
              {itinerary.title}
            </Text>
            {!!itinerary.subtitle && (
              <Text variant="sm" color="white">
                {itinerary.subtitle}
              </Text>
            )}
          </Flex>
        </Flex>
      ) : (
        <Flex testID="itinerary-header-no-image" px={2} pb={2} style={{ paddingTop: topInset }}>
          {!itinerary.isCurated && <Text variant="xs">{personalLabel}</Text>}

          <Text variant="xl">{itinerary.title}</Text>
          {!!itinerary.subtitle && <Text variant="sm">{itinerary.subtitle}</Text>}
        </Flex>
      )}

      <Flex px={2} pt={itinerary.isCurated ? 2 : 0}>
        {/* Only a curated guide has a byline: your own list has none. */}
        {!!itinerary.isCurated && !!itinerary.authorName && (
          <Text variant="xs" color="mono60">
            By {itinerary.authorName}
          </Text>
        )}

        {!!itinerary.description && (
          <Text variant="sm" mt={1}>
            {itinerary.description}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment ItineraryHeader_itinerary on Itinerary {
    internalID
    isCurated
    isMine
    title
    subtitle
    description
    authorName
    heroImage {
      url(version: "large")
      height
      width
      aspectRatio
      blurhash
    }
  }
`
