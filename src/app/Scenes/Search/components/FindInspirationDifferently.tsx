import {
  CameraStrokeIcon,
  ImageSetIcon,
  MapPinIcon,
  SparklesSquareStrokeIcon,
} from "@artsy/icons/native"
import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { useEnableArtsyLens } from "app/utils/hooks/useEnableArtsyLens"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isTablet } from "react-native-device-info"

const ICON_SIZE = 20

export const FindInspirationDifferently: React.FC = () => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()
  const showArtsyLens = useEnableArtsyLens()
  const showArtAssistant = useEnableArtAssistant()
  const enableCityGuideItineraries = useFeatureFlag("AREnableCityGuideItineraries")
  const colorScheme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)
  const isDarkMode = colorScheme === "dark"
  const cardBackgroundColor = isDarkMode ? "mono5" : "mono100"
  const cardTextColor = isDarkMode ? "mono100" : "mono0"
  const betaBackgroundColor = isDarkMode ? "mono10" : "mono60"
  const isTabletDevice = isTablet()
  const columns = isTabletDevice ? 4 : 2
  const cardWidth = (screenWidth - space(2) * 2 - space(1) * (columns - 1)) / columns
  const cardHeight = Math.max(125, cardWidth * 0.8)

  // The SVGs have different internal insets; align their visible strokes with the card padding.
  const cards = [
    {
      title: "Artsy Lens",
      description: "Find matching art with just a photo",
      href: "/lens",
      icon: (
        <CameraStrokeIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={cardTextColor}
          left="-2px"
          top="-3px"
        />
      ),
      beta: true,
      visible: showArtsyLens,
    },
    {
      title: "Art Assistant",
      description: "Describe what you want and we’ll find it",
      href: "/art-assistant",
      icon: (
        <SparklesSquareStrokeIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={cardTextColor}
          left="-2px"
          top="-1px"
        />
      ),
      beta: true,
      visible: showArtAssistant,
    },
    {
      title: "City Guide",
      description: "Create your own art world hit list",
      href: enableCityGuideItineraries ? "/city-guide" : "/local-discovery",
      icon: (
        <MapPinIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={cardTextColor}
          left="-3px"
          top="-1px"
        />
      ),
      beta: true,
      // City Guide (both the new and the legacy versions) is not supported on tablets
      visible: !isTabletDevice,
    },
    {
      title: "Discover Daily",
      description: "Find art you love, one swipe at a time",
      href: "/infinite-discovery",
      icon: (
        <ImageSetIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={cardTextColor}
          left="-1px"
          top="-1px"
        />
      ),
      beta: false,
      visible: true,
    },
  ].filter((card) => card.visible)

  return (
    <Flex px={2} pt={1}>
      <SectionTitle title="Find Inspiration Differently" />

      <Flex flexDirection="row" flexWrap="wrap" gap={1}>
        {cards.map((card) => (
          <RouterLink
            key={card.title}
            to={card.href}
            accessibilityRole="button"
            accessibilityLabel={card.beta ? `${card.title}, beta` : card.title}
            accessibilityHint={card.description}
          >
            <Flex
              width={cardWidth}
              height={cardHeight}
              backgroundColor={cardBackgroundColor}
              borderRadius={12}
              justifyContent="space-between"
              p={1}
            >
              <Flex flexDirection="row" alignItems="flex-start" justifyContent="space-between">
                {card.icon}
                {!!card.beta && (
                  <Flex
                    backgroundColor={betaBackgroundColor}
                    borderRadius={100}
                    px={1}
                    py={0.5}
                    position="relative"
                    top="-2px"
                  >
                    <Text variant="xxs" color={cardTextColor}>
                      BETA
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex>
                <Text
                  variant={cardWidth < 175 ? "sm-display" : "md"}
                  color={cardTextColor}
                  numberOfLines={2}
                >
                  {card.title}
                </Text>
                <Text variant="xs" color={cardTextColor} numberOfLines={2}>
                  {card.description}
                </Text>
              </Flex>
            </Flex>
          </RouterLink>
        ))}
      </Flex>
    </Flex>
  )
}
