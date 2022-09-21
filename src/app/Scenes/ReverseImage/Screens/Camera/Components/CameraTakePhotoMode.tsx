import { goBack } from "app/navigation/navigate"
import { Background, BACKGROUND_COLOR } from "app/Scenes/ReverseImage/Components/Background"
import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { HeaderTitle } from "app/Scenes/ReverseImage/Components/HeaderTitle"
import { FocusCoords } from "app/Scenes/ReverseImage/types"
import { BackButton, Flex } from "palette"
import { StyleSheet } from "react-native"
import { CameraButtons, CameraButtonsProps } from "./CameraButtons"
import { CameraFramesContainer, CameraFramesContainerProps } from "./CameraFramesContainer"
import { FocusIndicator } from "./FocusIndicator"

interface CameraTakePhotoModeProps extends CameraFramesContainerProps, CameraButtonsProps {
  coords: FocusCoords | null
}

export const CameraTakePhotoMode: React.FC<CameraTakePhotoModeProps> = (props) => {
  const { coords, focusEnabled, onFocusPress, ...other } = props

  return (
    <Flex {...StyleSheet.absoluteFillObject}>
      <Background>
        <HeaderContainer>
          <BackButton color="white100" onPress={goBack} />
          <HeaderTitle title="Position Artwork in this Frame" />
        </HeaderContainer>
      </Background>

      <CameraFramesContainer onFocusPress={onFocusPress} focusEnabled={focusEnabled} />

      <CameraButtons {...other} bg={BACKGROUND_COLOR} />

      {!!coords && <FocusIndicator coords={coords} />}
    </Flex>
  )
}
