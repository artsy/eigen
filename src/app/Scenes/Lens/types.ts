/**
 * `uri` is ALWAYS `file://`-prefixed, regardless of whether the photo came from the camera
 * or the library. The 2022 ReverseImage scene was inconsistent about this (camera results were
 * prefixed, library results were not), which was invisible in the simulator (no camera) and only
 * surfaced on device. Normalize at the boundary — see LensCameraPreview.tsx and
 * Screens/LensCamera.tsx's library handler.
 */
export type LensPhoto = {
  uri: string
  width: number
  height: number
  fromLibrary?: boolean
  /**
   * The measured size of the preview container the brackets were drawn against at capture time,
   * which is the container the crop has to invert against. Measured (see `LensCamera`'s `onLayout`)
   * rather than read from `useWindowDimensions()`: on Android the root content view is inset by the
   * status bar (`MainActivity` sets `android:fitsSystemWindows="true"`), so the window reports a
   * taller height than what actually renders, and the crop stops matching the brackets. Only set
   * for camera captures -- library-picked photos never get a full-screen bracket moment (see
   * `LensAnalyzing`).
   */
  captureContainerWidth?: number
  captureContainerHeight?: number
}

export type LensNavigationStack = {
  LensCamera: undefined
  LensAnalyzing: {
    photo: LensPhoto
  }
  LensResults: {
    s3Bucket: string
    s3Key: string
    photo: LensPhoto
  }
}
