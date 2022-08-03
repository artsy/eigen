import { StackScreenProps } from "@react-navigation/stack"
import { useImageSearchV2 } from "app/utils/useImageSearchV2"
import { compact } from "lodash"
import { BackButton, Flex, useSpace } from "palette"
import { useEffect } from "react"
import { Image, StyleSheet } from "react-native"
import styled from "styled-components/native"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { ReverseImageNavigationStack } from "../../types"
import { CAMERA_BUTTONS_HEIGHT } from "../Camera/Components/CameraButtons"

type Props = StackScreenProps<ReverseImageNavigationStack, "Preview">

export const ReverseImagePreviewScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props
  const { photo } = route.params
  const space = useSpace()
  const { handleSeachByImage } = useImageSearchV2()

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleSearch = async () => {
    try {
      const results = await handleSeachByImage(photo)

      if (results.length === 0) {
        return navigation.replace("ArtworkNotFound", {
          photoPath: photo.path,
        })
      }

      if (results.length === 1) {
        return navigation.navigate("Artwork", {
          artworkId: results[0]!.artwork!.internalID,
        })
      }

      const artworkIDs = compact(results.map((result) => result?.artwork?.internalID))
      navigation.navigate("MultipleResults", {
        artworkIDs,
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <Flex bg="black100" flex={1}>
      <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <BackButton color="white100" onPress={handleGoBack} />
            <HeaderTitle title="Looking for Results..." />
          </HeaderContainer>
        </Background>

        <Background height={space("2")} />

        <Flex flex={1} flexDirection="row">
          <Background width={space("2")} />
          <Flex flex={1} />
          <Background width={space("2")} />
        </Flex>

        <Background height={space("2")} />

        <Background height={CAMERA_BUTTONS_HEIGHT} />
      </Flex>
    </Flex>
  )
}

const CAMERA_BACKGROUND_COLOR = "rgba(0, 0, 0, 0.6)"

const Background = styled(Flex)`
  background: ${CAMERA_BACKGROUND_COLOR};
`
