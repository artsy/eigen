import { Button, Flex, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { PartnersHomeViewSection_section$key } from "__generated__/PartnersHomeViewSection_section.graphql"
import { Alert } from "react-native"
import { isTablet } from "react-native-device-info"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"

interface PartnersHomeViewSectionProps {
  section: PartnersHomeViewSection_section$key
}
export const PartnersHomeViewSection: React.FC<PartnersHomeViewSectionProps> = (props) => {
  const { width, height } = useScreenDimensions()

  const section = useFragment(partnersHomeViewSectionFragment, props.section)

  const imageHeight = height * 0.5

  const hasImage = !!section.component.backgroundImageURL
  const textColor = hasImage ? "white100" : "black100"

  return (
    <Flex>
      <Touchable
        onPress={() => {
          Alert.alert("Not yet implemented", "Coming Soon", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ])
        }}
        haptic="impactLight"
      >
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

            <Flex mt={0.5} maxWidth={150}>
              <Button
                variant={hasImage ? "outlineLight" : "fillDark"}
                size="small"
                onPress={() => {
                  Alert.alert("Not yet implemented", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                  ])
                }}
              >
                {section.component.buttonText}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    </Flex>
  )
}

const partnersHomeViewSectionFragment = graphql`
  fragment PartnersHomeViewSection_section on PartnersHomeViewSection {
    component {
      title
      backgroundImageURL
      buttonText
      description
    }
  }
`
