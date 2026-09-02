import { LensPhoto } from "app/Scenes/Lens/types"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import {
  Camera,
  CameraRef,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from "react-native-vision-camera"

// The ONLY file in the Lens scene that imports the camera library -- keep it that way, so
// swapping vision-camera for something else stays contained here.

export type LensCameraStatus =
  | { kind: "permission"; status: "undetermined" | "denied" }
  | { kind: "error" }
  | { kind: "ready"; hasTorch: boolean; canFocus: boolean }

export type LensCameraPreviewHandle = {
  takePhoto: () => void
  requestPermission: () => void
}

interface LensCameraPreviewProps {
  isActive: boolean
  torchEnabled: boolean
  onStatusChange: (status: LensCameraStatus) => void
  onCapture: (photo: LensPhoto) => void
  onError: (error: unknown) => void
}

export const LensCameraPreview = forwardRef<LensCameraPreviewHandle, LensCameraPreviewProps>(
  (props, ref) => {
    const { isActive, torchEnabled, onStatusChange, onCapture, onError } = props

    const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice("back")
    const photoOutput = usePhotoOutput({ qualityPrioritization: "speed" })
    const camera = useRef<CameraRef>(null)
    // Unmount the native <Camera> on a runtime error rather than leaving it up: on Android its
    // SurfaceView keeps compositing a black surface above the JS tree even after the session has
    // failed, hiding LensCameraErrorState underneath.
    const [hasErrored, setHasErrored] = useState(false)

    const statusChangeRef = useRef(onStatusChange)
    statusChangeRef.current = onStatusChange

    useEffect(() => {
      if (!hasPermission) {
        statusChangeRef.current({
          kind: "permission",
          status: canRequestPermission ? "undetermined" : "denied",
        })
        return
      }

      if (!device) {
        // No usable back camera -- treat as a runtime error rather than spinning forever.
        statusChangeRef.current({ kind: "error" })
        return
      }

      statusChangeRef.current({
        kind: "ready",
        hasTorch: device.hasTorch,
        canFocus: device.supportsFocusMetering,
      })
    }, [hasPermission, canRequestPermission, device])

    useImperativeHandle(
      ref,
      () => ({
        takePhoto: () => {
          // capturePhoto() rather than capturePhotoToFile(): the latter returns only a filePath,
          // with no dimensions.
          photoOutput
            .capturePhoto({ flashMode: "off" }, {})
            .then(async (photo) => {
              try {
                const path = await photo.saveToTemporaryFileAsync()
                onCapture({ uri: `file://${path}`, width: photo.width, height: photo.height })
              } finally {
                photo.dispose()
              }
            })
            .catch(onError)
        },
        requestPermission: () => {
          requestPermission().catch(onError)
        },
      }),
      [photoOutput, onCapture, onError, requestPermission]
    )

    if (!hasPermission || !device || hasErrored) {
      return null
    }

    return (
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        outputs={[photoOutput]}
        isActive={isActive}
        // Omitted, not "off", when disabled: an explicit torchMode on the first render makes
        // vision-camera call setTorchMode() before the CameraX session opens, which throws
        // `Camera is not active` on Android and tears the session down.
        torchMode={torchEnabled ? "on" : undefined}
        onError={(error) => {
          setHasErrored(true)
          onError(error)
        }}
        // Pinned even though it's vision-camera's default: `computePhotoCropRect` inverts exactly
        // this mapping, so the crop breaks if the default ever changes upstream.
        resizeMode="cover"
        // The native session keeps its zoom across isActive toggles (screens here are never
        // detached, see Lens.tsx), so a previous pinch would otherwise persist. Reads the minimum
        // off `controller` rather than `device.minZoom`: the configured session's minimum can
        // differ from the device's static one.
        onPreviewStarted={() => {
          const controller = camera.current?.controller
          if (controller) {
            controller.setZoom(controller.minZoom).catch(() => {})
          }
        }}
        // Both gestures native, deliberately: a JS responder overlay for tap coordinates (to draw
        // a focus ring) swallows the pinch's second touch before vision-camera's recognizer sees
        // it, whatever the touch-count gating. The cost is no callback for the tap, so no focus
        // ring -- autofocus still happens.
        enableNativeTapToFocusGesture
        enableNativeZoomGesture
      />
    )
  }
)
