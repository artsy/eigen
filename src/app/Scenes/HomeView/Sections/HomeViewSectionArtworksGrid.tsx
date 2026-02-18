import { Button, Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { HomeViewSectionArtworks_section$data } from "__generated__/HomeViewSectionArtworks_section.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useEffect, useRef, useState } from "react"
import { Animated } from "react-native"
import LinearGradient from "react-native-linear-gradient"

interface HomeViewSectionArtworksGridProps {
  section: HomeViewSectionArtworks_section$data
  variantName?: string
  moreHref: string | null
  onSectionViewAll: () => void
  buttonText: string
}

export const HomeViewSectionArtworksGrid: React.FC<HomeViewSectionArtworksGridProps> = ({
  section,
  variantName,
  moreHref,
  onSectionViewAll: _onSectionViewAll,
  buttonText,
}) => {
  const { height: screenHeight } = useScreenDimensions()
  const [isGridExpanded, setIsGridExpanded] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(1))
  const [scrollAnim] = useState(new Animated.Value(0))
  const gridContainerRef = useRef<any>(null)
  const floatingGridMaxHeight = isGridExpanded ? undefined : screenHeight * 0.6

  const artworks = extractNodes(section.artworksConnection)

  const isGridWithMetadata = variantName === "grid-six-works" || variantName === "grid-four-works"
  const isGridNoMetadata = variantName === "grid-no-metadata"
  const isGridFloatingCTA = variantName === "grid-floating-CTA"

  useEffect(() => {
    if (isGridExpanded) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setAnimationComplete(true)
        // Subtle scroll animation to show expanded content
        Animated.spring(scrollAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start()
      })
    }
  }, [isGridExpanded, fadeAnim, scrollAnim])

  if (isGridWithMetadata) {
    return (
      <Flex mx={2} gap={2}>
        <GenericGrid artworks={artworks} />

        <RouterLink to={moreHref} hasChildTouchable>
          <Button block variant="outline">
            View More
          </Button>
        </RouterLink>
      </Flex>
    )
  }

  if (isGridNoMetadata) {
    return (
      <Flex gap={2} mb={2}>
        <GenericGrid artworks={artworks} hideArtworMetaData />

        <RouterLink
          to={moreHref}
          hasChildTouchable
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Button block variant="outlineLight">
            {buttonText}
          </Button>
        </RouterLink>
      </Flex>
    )
  }

  if (isGridFloatingCTA) {
    return (
      <Animated.View
        style={{
          transform: [
            {
              translateY: animationComplete
                ? 0
                : scrollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -200],
                  }),
            },
          ],
        }}
      >
        <Flex position="relative" mx={2} ref={gridContainerRef}>
          <GenericGrid artworks={artworks} gridHeight={floatingGridMaxHeight} />

          {!animationComplete ? (
            <Animated.View
              style={{
                opacity: fadeAnim,
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
              }}
            >
              {/* Gradient fade effect */}
              <LinearGradient
                colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: "100%",
                  height: floatingGridMaxHeight ? floatingGridMaxHeight / 2 : 0,
                  pointerEvents: "none",
                }}
              />
              <Flex position="absolute" bottom={0}>
                <Button
                  block
                  variant="outline"
                  onPress={(e) => {
                    e.preventDefault()
                    setIsGridExpanded(true)
                  }}
                >
                  View More
                </Button>
              </Flex>
            </Animated.View>
          ) : (
            <RouterLink to={moreHref} hasChildTouchable>
              <Button block variant="outline" mt={1}>
                {buttonText}
              </Button>
            </RouterLink>
          )}
        </Flex>
      </Animated.View>
    )
  }

  return null
}
