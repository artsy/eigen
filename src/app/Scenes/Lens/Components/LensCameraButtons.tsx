import { BoltFillIcon, PhotographIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, FlexProps, Touchable, useSpace } from "@artsy/palette-mobile"
import { LensCapturePhotoButton } from "app/Scenes/Lens/Components/LensCapturePhotoButton"

export const LENS_CAMERA_BUTTONS_HEIGHT = 120

const SMALL_BUTTON_SIZE = 40

interface LensCameraButtonsProps extends FlexProps {
  /** "libraryOnly" drops the shutter and torch, so the flow stays completable without camera
   * access. */
  mode: "camera" | "libraryOnly"
  isCameraInitialized: boolean
  deviceHasTorch: boolean
  isTorchEnabled: boolean
  onTakePhoto: () => void
  onToggleTorch: () => void
  onSelectFromLibrary: () => void
}

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
        <Touchable
          testID="lens-torch-button"
          accessibilityRole="button"
          accessibilityLabel={isTorchEnabled ? "Turn off torch" : "Turn on torch"}
          onPress={onToggleTorch}
          disabled={!isCameraInitialized}
          hitSlop={DEFAULT_HIT_SLOP}
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
        </Touchable>
      )}

      <Touchable
        testID="lens-library-button"
        accessibilityRole="button"
        accessibilityLabel="Choose from library"
        onPress={onSelectFromLibrary}
        hitSlop={DEFAULT_HIT_SLOP}
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
          <PhotographIcon testID="lens-library-photo-icon" fill="mono100" width={18} height={18} />
        </Flex>
      </Touchable>
    </Flex>
  )
}
