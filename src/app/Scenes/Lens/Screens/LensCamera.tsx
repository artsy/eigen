import { Flex, Spinner, Theme } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureException, withScope } from "@sentry/react-native"
import {
  LensCameraButtons,
  LENS_CAMERA_BUTTONS_HEIGHT,
} from "app/Scenes/Lens/Components/LensCameraButtons"
import { LensCameraErrorState } from "app/Scenes/Lens/Components/LensCameraErrorState"
import {
  LensCameraPreview,
  LensCameraPreviewHandle,
  LensCameraStatus,
} from "app/Scenes/Lens/Components/LensCameraPreview"
import { LensCornerBrackets } from "app/Scenes/Lens/Components/LensCornerBrackets"
import { LensHeader } from "app/Scenes/Lens/Components/LensHeader"
import { LensPermissionPlaceholder } from "app/Scenes/Lens/Components/LensPermissionPlaceholder"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { goBack } from "app/system/navigation/navigate"
import { requestPhotos } from "app/utils/requestPhotos"
import useAppState from "app/utils/useAppState"
import { useRef, useState } from "react"
import { AppState, Linking } from "react-native"

type Props = StackScreenProps<LensNavigationStack, "LensCamera">

type LensScreenState = LensCameraStatus | { kind: "loading" }

/**
 * Permission and error states are surfaces swapped in behind an always-present header and button
 * row, so the library-picker fallback stays reachable whatever the camera is doing.
 */
export const LensCamera: React.FC<Props> = ({ navigation }) => {
  const [state, setState] = useState<LensScreenState>({ kind: "loading" })
  const [torchEnabled, setTorchEnabled] = useState(false)
  const camera = useRef<LensCameraPreviewHandle>(null)
  // Measured, not read from useWindowDimensions(), which over-reports height on Android -- see
  // `LensPhoto.captureContainerWidth`. With the window's value the brackets sit below true center.
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const isFocused = useIsFocused()
  const [appState, setAppState] = useState(AppState.currentState)
  useAppState({ onChange: setAppState })
  const isActive = isFocused && appState === "active"

  const reportError = (context: string, error: unknown) => {
    if (__DEV__) {
      console.error(context, error)
    } else {
      withScope((scope) => {
        scope.setTag("artsyLens", context)
        captureException(error)
      })
    }
  }

  const handleClose = () => {
    goBack()
  }

  const handleTakePhoto = () => {
    camera.current?.takePhoto()
  }

  const handleToggleTorch = () => {
    setTorchEnabled((current) => !current)
  }

  const handleSelectFromLibrary = async () => {
    try {
      const images = await requestPhotos(false)

      // iOS: user backed out of the picker without choosing anything.
      if (images.length === 0) {
        return
      }

      const [image] = images

      navigation.navigate("LensAnalyzing", {
        photo: {
          uri: image.path.startsWith("file://") ? image.path : `file://${image.path}`,
          width: image.width,
          height: image.height,
          fromLibrary: true,
        },
      })
    } catch (error) {
      // Android reports a plain cancellation as an error; iOS just resolves with no images.
      if ((error as Error)?.message === "User cancelled image selection") {
        return
      }

      reportError("selectPhotosFromLibrary", error)
    }
  }

  return (
    <Theme theme="v3light">
      <Flex
        flex={1}
        bg="mono100"
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout
          setContainerSize({ width, height })
        }}
      >
        {state.kind === "loading" && (
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Spinner color="mono0" />
          </Flex>
        )}

        {state.kind === "permission" && (
          <LensPermissionPlaceholder
            status={state.status}
            onRequestPermission={() => camera.current?.requestPermission()}
            onOpenSettings={() => Linking.openSettings()}
          />
        )}

        {state.kind === "error" && <LensCameraErrorState />}

        <LensCameraPreview
          ref={camera}
          isActive={!!isActive && state.kind === "ready"}
          torchEnabled={torchEnabled}
          onStatusChange={setState}
          onCapture={(photo) =>
            navigation.navigate("LensAnalyzing", {
              photo: {
                ...photo,
                captureContainerWidth: containerSize.width,
                captureContainerHeight: containerSize.height,
              },
            })
          }
          onError={(error) => {
            reportError("cameraError", error)
            setState({ kind: "error" })
          }}
        />

        {state.kind === "ready" && containerSize.width > 0 && (
          <LensCornerBrackets width={containerSize.width} height={containerSize.height} />
        )}

        <Flex position="absolute" top={0} left={0} right={0}>
          <LensHeader title="Artsy Lens" onClose={handleClose} />
        </Flex>

        <Flex position="absolute" bottom={0} left={0} right={0} height={LENS_CAMERA_BUTTONS_HEIGHT}>
          <LensCameraButtons
            mode={state.kind === "ready" ? "camera" : "libraryOnly"}
            isCameraInitialized={state.kind === "ready"}
            deviceHasTorch={state.kind === "ready" && state.hasTorch}
            isTorchEnabled={torchEnabled}
            onTakePhoto={handleTakePhoto}
            onToggleTorch={handleToggleTorch}
            onSelectFromLibrary={handleSelectFromLibrary}
          />
        </Flex>
      </Flex>
    </Theme>
  )
}
