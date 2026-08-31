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

/**
 * This is the ONLY file in the Lens scene that imports the camera library — see the spike plan's
 * "one seam that matters." Everything else (chrome, buttons, permission placeholder, error state)
 * is plain palette-mobile and doesn't care which library won the vision-camera-vs-expo-camera
 * timebox. If this file needs to be swapped for an expo-camera implementation later, nothing else
 * in the scene should need to change.
 *
 * Built against react-native-vision-camera@5's Nitro API (capturePhotoToFile, usePhotoOutput,
 * useCameraPermission, focusTo) — a full API rewrite from the v2 API the deleted 2022
 * `ReverseImageCamera.tsx` used (Camera.getCameraPermissionStatus/takePhoto/useCameraDevices).
 */

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
    // Once the native <Camera> view reports a runtime error, stop rendering it rather than
    // leaving it mounted. Confirmed live on Android (Pixel 6): the native camera SurfaceView
    // keeps compositing above the JS tree even after the session has failed/closed -- a bare
    // black surface -- which visually hides LensCameraErrorState's fallback UI underneath even
    // though React renders it correctly (verified via `adb shell uiautomator dump`: the error
    // text was present in the view hierarchy the whole time, just covered).
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
        // No usable back camera — treat the same as a runtime error rather than spinning forever.
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
          // Use the in-memory capturePhoto() rather than capturePhotoToFile() specifically to
          // get width/height off the resulting Photo — capturePhotoToFile() only returns a
          // filePath, with no dimensions.
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
        // Omitted (not "off") when disabled: passing an explicit torchMode on every render,
        // including the very first one, makes vision-camera eagerly call setTorchMode() before
        // the CameraX session finishes opening. Confirmed live on Android (Pixel 6): that call
        // throws `CameraControl$OperationCanceledException: Camera is not active` and tears the
        // whole session down. Only pass a real value once the user actually asks for "on".
        torchMode={torchEnabled ? "on" : undefined}
        onError={(error) => {
          setHasErrored(true)
          onError(error)
        }}
        // Pinned explicitly (this is already vision-camera's own default) because
        // `cropToViewfinder`'s crop math depends on knowing exactly how the preview maps onto the
        // screen -- see `computePhotoCropRect`'s docstring. Silently inheriting a default the crop
        // math is coupled to is a bug waiting to happen if that default ever changes upstream.
        resizeMode="cover"
        // Resets zoom back to fully-out whenever the preview (re)starts -- e.g. resuming from the
        // background while this screen is still focused -- rather than staying at wherever a
        // previous pinch left it. The native camera session (and its zoom state) persists across
        // isActive toggles for as long as this component stays mounted -- see LensCamera.tsx's
        // Stack.Navigator comment on why screens in this flow are never detached -- so nothing
        // else resets this automatically. Goes through `controller` (not `device.minZoom`,
        // per vision-camera's own docs: the actual configured session's minimum can differ from
        // the device's static reported one) and tolerates a race against camera startup the same
        // way focusTo's callers do elsewhere in this scene.
        onPreviewStarted={() => {
          const controller = camera.current?.controller
          if (controller) {
            controller.setZoom(controller.minZoom).catch(() => {})
          }
        }}
        // Both native gestures, not a custom JS-side tap overlay + native pinch. An earlier
        // version kept a custom `View` responder overlay on top of this preview (in LensCamera.tsx)
        // to get tap coordinates for a custom focus-ring indicator, paired with
        // enableNativeZoomGesture here for pinch. Confirmed on a real device: that combination
        // doesn't work -- the JS responder overlay swallows the pinch's second touch point before
        // vision-camera's native recognizer ever sees it, regardless of touch-count gating on the
        // overlay's onStartShouldSetResponder. enableNativeTapToFocusGesture and
        // enableNativeZoomGesture are two independent flags on the SAME native view, handled
        // entirely by vision-camera's own gesture code -- that's the combination that's actually
        // supported to coexist. Trade-off: there's no callback for the native tap gesture, so
        // there's no way to show a custom focus-ring visual at the tap point anymore (see the
        // deleted LensFocusIndicator) -- autofocus itself still happens, just without the marker.
        enableNativeTapToFocusGesture
        enableNativeZoomGesture
      />
    )
  }
)
