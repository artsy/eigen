import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Button,
  Flex,
  FlexProps,
  Skeleton,
  SkeletonBox,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { HomeViewSectionCardQuery } from "__generated__/HomeViewSectionCardQuery.graphql"
import { HomeViewSectionCard_section$key } from "__generated__/HomeViewSectionCard_section.graphql"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
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

  const { width, height } = useScreenDimensions()
  const section = useFragment(HomeViewSectionCardFragment, sectionProp)

  if (!section?.card) {
    return null
  }

  const imageHeight = height * 0.5

  const hasImage = !!section.card.image?.imageURL
  const textColor = hasImage ? "white100" : "black100"
  const buttonText = section.card.buttonText ?? "More"
  const route = getRoute(section.card)

  const onPress = () => {
    tracking.tappedShowMore(buttonText, section.contextModule as ContextModule)

    if (route) {
      navigate(route)
    }
  }

  return (
    <Flex {...flexProps}>
      <Touchable onPress={onPress} haptic="impactLight">
        {!!hasImage && (
          <Flex position="absolute">
            <FastImage
              source={{ uri: section.card.image.imageURL }}
              style={{ width: width, height: imageHeight }}
              resizeMode={isTablet() ? "contain" : "cover"}
            />
            <LinearGradient
              colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "40%",
                bottom: 0,
              }}
            />
          </Flex>
        )}

        <Flex justifyContent="flex-end" px={2} pb={2} height={hasImage ? imageHeight : undefined}>
          <Text variant="lg-display" color={textColor}>
            {section.card.title}
          </Text>

          <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
            <Flex flex={1} mr={2}>
              <Text variant="sm-display" color={textColor}>
                {section.card.subtitle}
              </Text>
            </Flex>

            {!!route && (
              <Flex mt={0.5} maxWidth={150}>
                <Button
                  variant={hasImage ? "outlineLight" : "fillDark"}
                  size="small"
                  onPress={onPress}
                >
                  {buttonText}
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Touchable>

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
      <Flex {...flexProps}>
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

export const HomeViewSectionCardQueryRenderer: React.FC<SectionSharedProps> = withSuspense(
  ({ sectionID, index, ...flexProps }) => {
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
  HomeViewSectionCardPlaceholder
)

function getRoute(card: any) {
  let route

  if (card?.href) {
    route = card.href
  } else if (card.entityType === "Page" && card.entityID === OwnerType.galleriesForYou) {
    // not a canonical web url, thus the indirection above
    route = "/galleries-for-you"
  }

  return route
}
