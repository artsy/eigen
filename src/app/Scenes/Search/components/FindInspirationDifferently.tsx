import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedCardGroup,
} from "@artsy/cohesion"
import {
  CameraStrokeIcon,
  ImageSetIcon,
  MapPinIcon,
  SparklesMessageIcon,
} from "@artsy/icons/native"
import { Flex, Text, useColor, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { useEnableArtsyLens } from "app/utils/hooks/useEnableArtsyLens"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isTablet } from "react-native-device-info"
import { useTracking } from "react-tracking"

const ICON_SIZE = 20
const SMALL_CARD_WIDTH = 165

interface DiscoveryMethodCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  beta: boolean
  visible: boolean
  destinationOwnerType: ScreenOwnerType
}

export const FindInspirationDifferently: React.FC = () => {
  const { trackEvent } = useTracking()
  const space = useSpace()
  const color = useColor()
  const { width: screenWidth } = useScreenDimensions()
  const showArtsyLens = useEnableArtsyLens()
  const showArtAssistant = useEnableArtAssistant()
  const enableCityGuideItineraries = useFeatureFlag("AREnableCityGuideItineraries")
  const colorScheme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)
  const isDarkMode = colorScheme === "dark"
  const cardBackgroundColor = isDarkMode ? "mono5" : "mono100"
  const cardTextColor = isDarkMode ? "mono100" : "mono0"
  const isTabletDevice = isTablet()
  const columns = isTabletDevice ? 4 : 2
  const cardWidth = (screenWidth - space(2) * 2 - space(1) * (columns - 1)) / columns
  const cardHeight = Math.max(125, cardWidth * 0.8)
  const cityGuideHref = enableCityGuideItineraries ? "/city-guide" : "/local-discovery"
  const cityGuideOwnerType = enableCityGuideItineraries
    ? OwnerType.cityGuide
    : OwnerType.cityGuideMap

  const trackCardGroup = (destinationOwnerType: ScreenOwnerType, href: string) => {
    const event: TappedCardGroup = {
      action: ActionType.tappedCardGroup,
      context_module: ContextModule.artDiscoveryMethods,
      context_screen_owner_type: OwnerType.search,
      destination_screen_owner_type: destinationOwnerType,
      destination_path: href,
      type: "thumbnail",
    }

    trackEvent(event)
  }

  // The SVGs have different internal insets; align their visible strokes with the card padding.
  const cards: DiscoveryMethodCard[] = [
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
      destinationOwnerType: OwnerType.searchByImage,
    },
    {
      title: "Art Assistant",
      description: "Describe what you want and we’ll find it",
      href: "/art-assistant",
      icon: (
        <SparklesMessageIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={cardTextColor}
          left="-2px"
          top="-3px"
        />
      ),
      beta: true,
      visible: showArtAssistant,
      destinationOwnerType: OwnerType.artAssistant,
    },
    {
      title: "City Guide",
      description: "Create your own art world hit list",
      href: cityGuideHref,
      icon: (
        <MapPinIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={cardTextColor}
          left="-3px"
          top="-1px"
        />
      ),
      beta: enableCityGuideItineraries,
      // City Guide (both the new and the legacy versions) is not supported on tablets
      visible: !isTabletDevice,
      destinationOwnerType: cityGuideOwnerType,
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
      destinationOwnerType: OwnerType.infiniteDiscoveryArtwork,
    },
  ]
  const visibleCards = cards.filter((card) => card.visible)

  return (
    <Flex px={2} pt={1}>
      <SectionTitle title="Discover Art Your Way" mb={1} />

      <Flex flexDirection="row" flexWrap="wrap" gap={1}>
        {visibleCards.map((card) => (
          <RouterLink
            key={card.title}
            to={card.href}
            accessibilityRole="button"
            accessibilityLabel={card.beta ? `${card.title}, beta` : card.title}
            accessibilityHint={card.description}
            onPress={() => trackCardGroup(card.destinationOwnerType, card.href)}
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
                  <Text
                    color="white"
                    backgroundColor={color("blue100")}
                    style={{ paddingHorizontal: space(0.5) }}
                    variant="xs"
                  >
                    BETA
                  </Text>
                )}
              </Flex>

              <Flex>
                <Text
                  variant={cardWidth < SMALL_CARD_WIDTH ? "sm-display" : "md"}
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
