import { StackScreenProps } from "@react-navigation/stack"
import { ArtsyLogoIcon, BackButton, Flex, Text } from "palette"
import React from "react"
import { StyleSheet } from "react-native"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { ReverseImageNavigationStack } from "../../types"

type Props = StackScreenProps<ReverseImageNavigationStack, "Artwork">

export const ReverseImageArtworkScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props
  const { artworkId } = route.params

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <Flex flex={1} bg="black100">
      <HeaderContainer>
        <BackButton color="white100" onPress={handleGoBack} />
        <Flex
          {...StyleSheet.absoluteFillObject}
          pointerEvents="none"
          justifyContent="center"
          alignItems="center"
        >
          <ArtsyLogoIcon scale={0.75} fill="white100" />
        </Flex>
      </HeaderContainer>
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text color="white100">Info about {artworkId}</Text>
      </Flex>
    </Flex>
  )
}
