import { DocumentIcon, Flex, FlexProps, useSpace } from "palette"
import { TouchableOpacity } from "react-native"
import { CapturePhotoButton } from "./CapturePhotoButton"

export const CAMERA_BUTTONS_HEIGHT = 120

interface CameraButtonsProps extends FlexProps {
  isCameraInitialized: boolean
  deviceHasFlash: boolean
  isFlashEnabled: boolean
  takePhoto: () => void
  toggleFlash: () => void
  selectPhotosFromLibrary: () => void
}

const SMALL_BUTTONS_SIZE = 40

export const CameraButtons: React.FC<CameraButtonsProps> = (props) => {
  const {
    isCameraInitialized,
    deviceHasFlash,
    isFlashEnabled,
    takePhoto,
    toggleFlash,
    selectPhotosFromLibrary,
    ...rest
  } = props
  const space = useSpace()

  return (
    <Flex height={CAMERA_BUTTONS_HEIGHT} justifyContent="center" alignItems="center" {...rest}>
      <CapturePhotoButton onPress={takePhoto} disabled={!isCameraInitialized} />

      {!!deviceHasFlash && (
        <TouchableOpacity
          onPress={toggleFlash}
          disabled={!isCameraInitialized}
          style={{ position: "absolute", right: space("2") }}
        >
          <Flex
            width={SMALL_BUTTONS_SIZE}
            height={SMALL_BUTTONS_SIZE}
            borderRadius={SMALL_BUTTONS_SIZE / 2}
            bg={isFlashEnabled ? "green100" : "white100"}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={selectPhotosFromLibrary}
        disabled={!isCameraInitialized}
        style={{ position: "absolute", left: space("2") }}
      >
        <Flex
          width={SMALL_BUTTONS_SIZE}
          height={SMALL_BUTTONS_SIZE}
          borderRadius={SMALL_BUTTONS_SIZE / 2}
          justifyContent="center"
          alignItems="center"
          bg="white100"
        >
          <DocumentIcon />
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}
