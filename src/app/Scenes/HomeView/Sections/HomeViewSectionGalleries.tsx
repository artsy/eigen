import { ContextModule } from "@artsy/cohesion"
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
import { HomeViewSectionGalleriesQuery } from "__generated__/HomeViewSectionGalleriesQuery.graphql"
import { HomeViewSectionGalleries_section$key } from "__generated__/HomeViewSectionGalleries_section.graphql"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { isTablet } from "react-native-device-info"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionGalleriesProps {
  section: HomeViewSectionGalleries_section$key
  index: number
}

export const HomeViewSectionGalleries: React.FC<HomeViewSectionGalleriesProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const { width, height } = useScreenDimensions()
  const section = useFragment(HomeViewSectionGalleriesFragment, sectionProp)

  if (!section?.component) {
    return null
  }

  const imageHeight = height * 0.5

  const hasImage = !!section.component.backgroundImageURL
  const textColor = hasImage ? "white100" : "black100"

  const viewAll = section.component.behaviors?.viewAll

  const onSectionViewAll = () => {
    tracking.tappedShowMore("Explore", section.contextModule as ContextModule)

    if (viewAll?.href) {
      navigate(viewAll.href)
    } else {
      navigate("/galleries-for-you")
    }
  }

  return (
    <Flex {...flexProps}>
      <Touchable onPress={onSectionViewAll} haptic="impactLight">
        {!!hasImage && (
          <Flex position="absolute">
            <FastImage
              source={{ uri: section.component.backgroundImageURL }}
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
            {section.component.title}
          </Text>

          <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
            <Flex flex={1} mr={2}>
              <Text variant="sm-display" color={textColor}>
                {section.component.description}
              </Text>
            </Flex>

            {!!viewAll && (
              <Flex mt={0.5} maxWidth={150}>
                <Button
                  variant={hasImage ? "outlineLight" : "fillDark"}
                  size="small"
                  onPress={onSectionViewAll}
                >
                  Explore
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

const HomeViewSectionGalleriesFragment = graphql`
  fragment HomeViewSectionGalleries_section on HomeViewSectionGalleries {
    __typename
    internalID
    contextModule
    component {
      title
      backgroundImageURL
      description
      behaviors {
        viewAll {
          href
        }
      }
    }
  }
`

const HomeViewSectionGalleriesPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const { height } = useScreenDimensions()

  return (
    <Skeleton>
      <Flex {...flexProps}>
        <SkeletonBox height={height * 0.5} width="100%"></SkeletonBox>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionGalleriesQuery = graphql`
  query HomeViewSectionGalleriesQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionGalleries_section
      }
    }
  }
`

export const HomeViewSectionGalleriesQueryRenderer: React.FC<SectionSharedProps> = withSuspense(
  ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionGalleriesQuery>(
      homeViewSectionGalleriesQuery,
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

    return <HomeViewSectionGalleries section={data.homeView.section} index={index} {...flexProps} />
  },
  HomeViewSectionGalleriesPlaceholder
)
