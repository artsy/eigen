import { Flex, Spinner } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureException, withScope } from "@sentry/react-native"
import {
  LensCameraButtons,
  LENS_CAMERA_BUTTONS_HEIGHT,
} from "app/Scenes/Lens/Components/LensCameraButtons"
import { LensCameraErrorState } from "app/Scenes/Lens/Components/LensCameraErrorState"
import { LensCameraHeader } from "app/Scenes/Lens/Components/LensCameraHeader"
import {
  LensCameraPreview,
  LensCameraPreviewHandle,
  LensCameraStatus,
} from "app/Scenes/Lens/Components/LensCameraPreview"
import { LensCornerBrackets } from "app/Scenes/Lens/Components/LensCornerBrackets"
import { LensPermissionPlaceholder } from "app/Scenes/Lens/Components/LensPermissionPlaceholder"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { dismissModal } from "app/system/navigation/navigate"
import { requestPhotos } from "app/utils/requestPhotos"
import { useIsForeground } from "app/utils/useIsForeground"
import { useRef, useState } from "react"
import { Linking } from "react-native"

type Props = StackScreenProps<LensNavigationStack, "LensCamera">

type LensScreenState = LensCameraStatus | { kind: "loading" }

/**
 * Full-screen camera capture. Structural difference from the deleted 2022 `ReverseImageCamera`:
 * permission/error states are *surfaces* the screen swaps behind an always-present header and
 * button row, not dead ends — the library-picker fallback stays reachable no matter what the
 * camera is doing. See the spike plan's "Screen composition" section.
 */
export const LensCamera: React.FC<Props> = ({ navigation }) => {
  const [state, setState] = useState<LensScreenState>({ kind: "loading" })
  const [torchEnabled, setTorchEnabled] = useState(false)
  const camera = useRef<LensCameraPreviewHandle>(null)
  // Measured via onLayout below rather than read from useWindowDimensions(), which over-reports
  // height on Android -- see `LensPhoto.captureContainerWidth`. The brackets need the real rendered
  // size, or they center on a taller coordinate space than what's visible and sit below true
  // center.
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

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
    // Not navigation.goBack() -- LensCamera is the ROOT of this independent stack, so the local
    // navigator has nothing to pop to and goBack() would silently no-op. dismissModal() reaches
    // through to the outer app navigator that actually presented this modal (same pattern as
    // MyCollectionArtworkForm.tsx). The deleted 2022 ReverseImageCamera.tsx had this same
    // independent-stack-root shape and deliberately imported the *global* `goBack` for its close
    // button rather than using the local `navigation` prop, for the same reason.
    dismissModal()
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

      {/*
        Always mounted, regardless of `state` — its internal effect is what *produces* every
        state transition (loading -> permission/error/ready), including re-checking permission
        after the placeholder's "Enable Access" is tapped. Gating it on `state` would deadlock:
        it would never mount to report the status that ungates it. It renders nothing itself
        until authorized, so this is safe alongside the placeholder/error surfaces above.
      */}
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

      {/*
        Wrapped in its own absolute-positioned container — the header must float at the top
        regardless of what else is on screen. Without this it's just another flex-column sibling,
        and whichever surface above it renders with `flex={1}` (the permission placeholder, the
        error state, the loading spinner) consumes all available height first, pushing the header
        down to the bottom of the screen instead of the top. (Caught live via the ios-simulator
        accessibility tree — AXFrame put the title/close button at y=842 on an 874pt-tall screen.)

        Deliberately not "Search with your camera" as the title — LensPermissionPlaceholder uses
        that exact phrase as its own headline, and this chrome title is visible alongside it (and
        alongside the live preview, and the error state), so a distinct, more general label avoids
        showing the same sentence twice on screen at once.
      */}
      <Flex position="absolute" top={0} left={0} right={0}>
        <LensCameraHeader title="Artsy Lens" onClose={handleClose} />
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
  )
}
