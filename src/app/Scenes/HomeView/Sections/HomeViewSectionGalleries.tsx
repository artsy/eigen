import { Button, Flex, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { HomeViewSectionGalleries_section$key } from "__generated__/HomeViewSectionGalleries_section.graphql"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { isTablet } from "react-native-device-info"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionGalleriesProps {
  section: HomeViewSectionGalleries_section$key
}
export const HomeViewSectionGalleries: React.FC<HomeViewSectionGalleriesProps> = (props) => {
  const { tappedShowMore } = useHomeViewTracking()

  const { width, height } = useScreenDimensions()
  const section = useFragment(HomeViewSectionGalleriesFragment, props.section)

  if (!section?.component) {
    return null
  }

  const imageHeight = height * 0.5

  const hasImage = !!section.component.backgroundImageURL
  const textColor = hasImage ? "white100" : "black100"

  const componentHref = section.component?.behaviors?.viewAll?.href

  const handleOnPress = () => {
    tappedShowMore("Explore", section.internalID)

    if (componentHref) {
      navigate(componentHref)
    }
  }

  return (
    <Flex>
      <Touchable onPress={handleOnPress} haptic="impactLight">
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

            {!!componentHref && (
              <Flex mt={0.5} maxWidth={150}>
                <Button
                  variant={hasImage ? "outlineLight" : "fillDark"}
                  size="small"
                  onPress={handleOnPress}
                >
                  Explore
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Touchable>
    </Flex>
  )
}

const HomeViewSectionGalleriesFragment = graphql`
  fragment HomeViewSectionGalleries_section on HomeViewSectionGalleries {
    internalID
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
