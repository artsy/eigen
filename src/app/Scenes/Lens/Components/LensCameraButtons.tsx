import { BoltFillIcon, ImageSetIcon } from "@artsy/icons/native"
import { Flex, FlexProps, useSpace } from "@artsy/palette-mobile"
import { LensCapturePhotoButton } from "app/Scenes/Lens/Components/LensCapturePhotoButton"
import { TouchableOpacity } from "react-native"

export const LENS_CAMERA_BUTTONS_HEIGHT = 120

const SMALL_BUTTON_SIZE = 40

interface LensCameraButtonsProps extends FlexProps {
  /**
   * "camera" shows the shutter + torch alongside the library button. "libraryOnly" is used
   * whenever the live preview isn't available — permission not yet granted/denied, or a camera
   * runtime error — so a user without camera access can still complete the flow via the library.
   */
  mode: "camera" | "libraryOnly"
  isCameraInitialized: boolean
  deviceHasTorch: boolean
  isTorchEnabled: boolean
  onTakePhoto: () => void
  onToggleTorch: () => void
  onSelectFromLibrary: () => void
}

/**
 * Restyled/renamed from the deleted 2022 `CameraButtons.tsx`. Two behavior changes from that
 * version: (1) the library button is always enabled, even before the shutter/torch exist, so the
 * fallback path works without camera access; (2) the toggle drives a continuous torch for framing
 * (Google-Lens-style), not a flash that fires on shutter — see LensCameraPreview.tsx.
 */
export const LensCameraButtons: React.FC<LensCameraButtonsProps> = (props) => {
  const {
    mode,
    isCameraInitialized,
    deviceHasTorch,
    isTorchEnabled,
    onTakePhoto,
    onToggleTorch,
    onSelectFromLibrary,
    ...rest
  } = props
  const space = useSpace()

  return (
    <Flex height={LENS_CAMERA_BUTTONS_HEIGHT} justifyContent="center" alignItems="center" {...rest}>
      {mode === "camera" && (
        <LensCapturePhotoButton
          testID="lens-shutter-button"
          onPress={onTakePhoto}
          disabled={!isCameraInitialized}
        />
      )}

      {mode === "camera" && !!deviceHasTorch && (
        <TouchableOpacity
          testID="lens-torch-button"
          accessibilityRole="button"
          accessibilityLabel={isTorchEnabled ? "Turn off torch" : "Turn on torch"}
          onPress={onToggleTorch}
          disabled={!isCameraInitialized}
          style={{ position: "absolute", right: space(2) }}
        >
          <Flex
            width={SMALL_BUTTON_SIZE}
            height={SMALL_BUTTON_SIZE}
            borderRadius={SMALL_BUTTON_SIZE / 2}
            bg={isTorchEnabled ? "mono0" : "mono100"}
            borderWidth={1}
            borderColor="mono0"
            justifyContent="center"
            alignItems="center"
          >
            <BoltFillIcon fill={isTorchEnabled ? "mono100" : "mono0"} width={18} height={18} />
          </Flex>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        testID="lens-library-button"
        accessibilityRole="button"
        accessibilityLabel="Choose from library"
        onPress={onSelectFromLibrary}
        style={
          mode === "camera" ? { position: "absolute", left: space(2) } : { position: "absolute" }
        }
      >
        <Flex
          width={SMALL_BUTTON_SIZE}
          height={SMALL_BUTTON_SIZE}
          borderRadius={SMALL_BUTTON_SIZE / 2}
          justifyContent="center"
          alignItems="center"
          bg="mono0"
        >
          <ImageSetIcon fill="mono100" width={18} height={18} />
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}
