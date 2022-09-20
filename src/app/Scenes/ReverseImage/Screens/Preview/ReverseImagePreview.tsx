import { StackScreenProps } from "@react-navigation/stack"
import { BackButton, Box, Button, Flex } from "palette"
import { Image, StyleSheet } from "react-native"
import { Background } from "../../Components/Background"
import { CameraFramesContainer } from "../../Components/CameraFramesContainer"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { ReverseImageNavigationStack } from "../../types"
import { CAMERA_BUTTONS_HEIGHT } from "../Camera/Components/CameraButtons"

type Props = StackScreenProps<ReverseImageNavigationStack, "Preview">

export const ReverseImagePreviewScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props
  const { photo } = route.params

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <Flex bg="black100" flex={1}>
      <Image
        source={{ uri: photo.path }}
        style={StyleSheet.absoluteFill}
        resizeMode={photo.fromLibrary ? "contain" : "cover"}
      />

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <BackButton color="white100" onPress={handleGoBack} />
            <HeaderTitle title="Captured Photo" />
          </HeaderContainer>
        </Background>

        {!photo.fromLibrary && (
          <>
            <CameraFramesContainer />
            <Background height={CAMERA_BUTTONS_HEIGHT} />
          </>
        )}

        <Box p={2} bg="red">
          <Button block width="100%" onPress={handleGoBack}>
            Back to camera
          </Button>
        </Box>
      </Flex>
    </Flex>
  )
}
