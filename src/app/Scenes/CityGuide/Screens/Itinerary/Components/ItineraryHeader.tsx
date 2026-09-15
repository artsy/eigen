import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { ItineraryHeader_itinerary$key } from "__generated__/ItineraryHeader_itinerary.graphql"
import { ItineraryAddFullListButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"

const HERO_HEIGHT = 300
const NO_ICON_SIZE = 40

interface Props {
  itinerary: ItineraryHeader_itinerary$key
}

export const ItineraryHeader: React.FC<Props> = ({ itinerary: itineraryRef }) => {
  const itinerary = useFragment(fragment, itineraryRef)
  const heroImage = itinerary.heroImage

  return (
    <Flex>
      <Flex height={HERO_HEIGHT} justifyContent="flex-end">
        <Flex style={{ position: "absolute", width: "100%", height: HERO_HEIGHT }}>
          {heroImage?.url ? (
            <Image
              testID="itinerary-hero-image"
              src={heroImage.url}
              blurhash={heroImage.blurhash}
              resizeMode="cover"
              height={HERO_HEIGHT}
            />
          ) : (
            <Flex
              testID="itinerary-hero-no-image"
              position="absolute"
              width="100%"
              height={HERO_HEIGHT}
              backgroundColor="mono10"
              alignItems="center"
              justifyContent="center"
            >
              <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
            </Flex>
          )}
        </Flex>

        <LinearGradient
          testID="itinerary-hero-scrim"
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{ position: "absolute", bottom: 0, width: "100%", height: HERO_HEIGHT / 2 }}
        />

        <Flex p={2}>
          {/* The designs label your own itinerary above its name. A curated guide has its
              byline instead, below. */}
          {!itinerary.isCurated && (
            <Text variant="xs" color="mono0">
              Your Itinerary
            </Text>
          )}

          <Text variant="xl" color="mono0">
            {itinerary.title}
          </Text>
          {!!itinerary.subtitle && (
            <Text variant="sm" color="mono0">
              {itinerary.subtitle}
            </Text>
          )}
        </Flex>
      </Flex>

      <Flex px={2} pt={2}>
        {/* Both belong to a curated guide: your own list has no byline and nothing to bulk-add. */}
        {!!itinerary.isCurated && (
          <>
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              {!!itinerary.authorName && (
                <Text variant="xs" color="mono60">
                  By {itinerary.authorName}
                </Text>
              )}

              <ItineraryAddFullListButton
                citySlug={itinerary.citySlug}
                itineraryId={itinerary.internalID}
                title={itinerary.title}
              />
            </Flex>
          </>
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
    citySlug
    title
    subtitle
    description
    authorName
    heroImage {
      url(version: "large")
      height
      width
      blurhash
    }
  }
`
