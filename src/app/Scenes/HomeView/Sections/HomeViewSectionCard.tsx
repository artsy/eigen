import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Button,
  Flex,
  FlexProps,
  Skeleton,
  SkeletonBox,
  Text,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { HomeViewSectionCardQuery } from "__generated__/HomeViewSectionCardQuery.graphql"
import { HomeViewSectionCard_section$key } from "__generated__/HomeViewSectionCard_section.graphql"
import { HeroUnit } from "app/Scenes/HomeView/Components/HeroUnit"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { isTablet } from "react-native-device-info"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionCardProps {
  section: HomeViewSectionCard_section$key
  index: number
}

export const HomeViewSectionCard: React.FC<HomeViewSectionCardProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)
  const space = useSpace()
  const color = useColor()

  const { width, height } = useScreenDimensions()
  const section = useFragment(HomeViewSectionCardFragment, sectionProp)

  if (!section?.card) {
    return null
  }

  const { title, subtitle, image, buttonText: btnText, badgeText } = section.card

  const imageHeight = height * 0.5

  const hasImage = !!image?.imageURL
  const textColor = hasImage && theme !== "dark" ? "mono0" : "mono100"
  const buttonText = btnText ?? "More"
  const route = getRoute(section.card)

  const onPress = () => {
    tracking.tappedShowMore(buttonText, section.contextModule as ContextModule)
  }

  return (
    <Flex {...flexProps}>
      {isTablet() ? (
        <HeroUnit
          item={{
            title: title,
            body: subtitle,
            imageSrc: image?.imageURL ?? "",
            url: route,
            buttonText: buttonText,
          }}
          onPress={onPress}
        />
      ) : (
        <RouterLink onPress={onPress} to={route} haptic="impactLight">
          {!!hasImage && (
            <Flex position="absolute">
              <FastImage
                source={{ uri: image.imageURL }}
                style={{ width: width, height: imageHeight }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
                start={{ x: 0, y: 0.3 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  bottom: 0,
                }}
              />
            </Flex>
          )}

          <Flex justifyContent="flex-end" px={2} pb={2} height={hasImage ? imageHeight : undefined}>
            {!!badgeText && (
              <Flex flexDirection="row" mb={0.5}>
                <Text
                  // We want to always show the badge text on white to make sure it's accessible on dark mode
                  color="white"
                  backgroundColor={color("blue100")}
                  style={{ paddingHorizontal: space(0.5) }}
                  variant="xs"
                >
                  {badgeText}
                </Text>
              </Flex>
            )}

            <Text variant="lg-display" color={textColor}>
              {title}
            </Text>

            <Flex mt={0.5} justifyContent="space-between" flexDirection="row" alignItems="flex-end">
              <Flex flex={1} mr={2}>
                <Text variant="sm-display" color={textColor}>
                  {subtitle}
                </Text>
              </Flex>

              {!!route && (
                <Flex mt={0.5} maxWidth={150}>
                  <RouterLink hasChildTouchable onPress={onPress} to={route}>
                    <Button
                      variant={hasImage && theme !== "dark" ? "outlineLight" : "fillDark"}
                      size="small"
                      iconPosition="right"
                    >
                      {buttonText}
                    </Button>
                  </RouterLink>
                </Flex>
              )}
            </Flex>
          </Flex>
        </RouterLink>
      )}

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const HomeViewSectionCardFragment = graphql`
  fragment HomeViewSectionCard_section on HomeViewSectionCard {
    __typename
    internalID
    contextModule
    card {
      title
      subtitle
      href
      badgeText
      buttonText
      image {
        imageURL
      }
      entityID
      entityType
    }
  }
`

const HomeViewSectionCardPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const { height } = useScreenDimensions()

  return (
    <Skeleton>
      <Flex {...flexProps} testID="HomeViewSectionCardPlaceholder">
        <SkeletonBox height={height * 0.5} width="100%"></SkeletonBox>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionCardQuery = graphql`
  query HomeViewSectionCardQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionCard_section
      }
    }
  }
`

export const HomeViewSectionCardQueryRenderer: React.FC<SectionSharedProps> = memo((props) => {
  const isInfiniteDiscoveryEnabled = useFeatureFlag("AREnableInfiniteDiscovery")

  if (props.sectionID === "home-view-section-infinite-discovery" && !isInfiniteDiscoveryEnabled) {
    return null
  }

  return withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionCardQuery>(
        homeViewSectionCardQuery,
        {
          id: sectionID,
        },
        {
          networkCacheConfig: {
            force: false,
          },
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return <HomeViewSectionCard section={data.homeView.section} index={index} {...flexProps} />
    },
    LoadingFallback: HomeViewSectionCardPlaceholder,
    ErrorFallback: NoFallback,
  })(props)
})

function getRoute(card: any) {
  let route

  if (card?.href) {
    return card.href
  }

  if (card.entityType === "Page" && card.entityID === OwnerType.galleriesForYou) {
    // not a canonical web url, thus the indirection above
    return "/galleries-for-you"
  }

  if (card.entityType === "Page" && card.entityID === OwnerType.infiniteDiscovery) {
    return "/infinite-discovery"
  }

  return route
}
