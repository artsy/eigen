import { goBack } from "app/navigation/navigate"
import { Background } from "app/Scenes/ReverseImage/Components/Background"
import { CameraFramesContainer } from "app/Scenes/ReverseImage/Components/CameraFramesContainer"
import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { HeaderTitle } from "app/Scenes/ReverseImage/Components/HeaderTitle"
import { PhotoEntity } from "app/Scenes/ReverseImage/types"
import { BackButton, Flex } from "palette"
import { Image, StyleSheet } from "react-native"
import { CAMERA_BUTTONS_HEIGHT } from "./CameraButtons"

interface CameraPreviewPhotoModeProps {
  photo: PhotoEntity
}

export const CameraPreviewPhotoMode: React.FC<CameraPreviewPhotoModeProps> = (props) => {
  const { photo } = props

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
            <BackButton color="white100" onPress={goBack} />
            <HeaderTitle title="Looking for Results..." />
          </HeaderContainer>
        </Background>

        {!photo.fromLibrary && (
          <>
            <CameraFramesContainer />
            <Background height={CAMERA_BUTTONS_HEIGHT} />
          </>
        )}
      </Flex>
    </Flex>
  )
}
