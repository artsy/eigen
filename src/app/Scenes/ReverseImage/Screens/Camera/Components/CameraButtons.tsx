import { Flex, FlexProps, useSpace } from "palette"
import { TouchableOpacity } from "react-native"

export const CAMERA_BUTTONS_HEIGHT = 120

interface CameraButtonsProps extends FlexProps {
  isCameraInitialized: boolean
  deviceHasFlash: boolean
  isFlashEnabled: boolean
  takePhoto: () => void
  toggleFlash: () => void
}

export const CameraButtons: React.FC<CameraButtonsProps> = (props) => {
  const { isCameraInitialized, deviceHasFlash, isFlashEnabled, takePhoto, toggleFlash, ...rest } =
    props
  const space = useSpace()

  return (
    <Flex height={CAMERA_BUTTONS_HEIGHT} justifyContent="center" alignItems="center" {...rest}>
      <TouchableOpacity onPress={takePhoto} disabled={!isCameraInitialized}>
        <Flex width={50} height={50} borderRadius={25} bg="white100" />
      </TouchableOpacity>

      {!!deviceHasFlash && (
        <TouchableOpacity
          onPress={toggleFlash}
          disabled={!isCameraInitialized}
          style={{ position: "absolute", right: space("2") }}
        >
          <Flex
            width={30}
            height={30}
            borderRadius={15}
            bg={isFlashEnabled ? "green100" : "white100"}
          />
        </TouchableOpacity>
      )}
    </Flex>
  )
}
