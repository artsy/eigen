import { Flex, Image, Text } from "@artsy/palette-mobile"
import { ItineraryHeader_itinerary$key } from "__generated__/ItineraryHeader_itinerary.graphql"
import { ItineraryAddFullListButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
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
}

export const ItineraryHeader: React.FC<Props> = ({ itinerary: itineraryRef, topInset }) => {
  const itinerary = useFragment(fragment, itineraryRef)
  const heroImage = itinerary.heroImage

  return (
    <Flex>
      {heroImage?.url ? (
        <Flex height={HERO_HEIGHT} justifyContent="flex-end">
          <Flex style={{ position: "absolute", width: "100%", height: HERO_HEIGHT }}>
            <Image
              testID="itinerary-hero-image"
              src={heroImage.url}
              blurhash={heroImage.blurhash}
              aspectRatio={heroImage.aspectRatio}
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
      ) : (
        <Flex testID="itinerary-header-no-image" px={2} pb={2} style={{ paddingTop: topInset }}>
          {!itinerary.isCurated && <Text variant="xs">Your Itinerary</Text>}

          <Text variant="xl">{itinerary.title}</Text>
          {!!itinerary.subtitle && <Text variant="sm">{itinerary.subtitle}</Text>}
        </Flex>
      )}

      <Flex px={2} pt={itinerary.isCurated ? 2 : 0}>
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
                itinerarySlug={itinerary.slug ?? undefined}
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
    slug
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
