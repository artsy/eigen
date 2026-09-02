/**
 * `uri` is ALWAYS `file://`-prefixed -- normalized at both boundaries (`LensCameraPreview` and
 * `LensCamera`'s library handler), since the library path doesn't prefix it on its own.
 */
export type LensPhoto = {
  uri: string
  width: number
  height: number
  fromLibrary?: boolean
  /**
   * The container the brackets were drawn against at capture time, which is what the crop has to
   * invert against. Measured (`LensCamera`'s `onLayout`) rather than taken from
   * `useWindowDimensions()`: on Android the root view is inset by the status bar, so the window
   * over-reports height and the crop stops matching the brackets. Camera captures only.
   */
  captureContainerWidth?: number
  captureContainerHeight?: number
}

export type LensNavigationStack = {
  LensCamera: undefined
  LensAnalyzing: {
    photo: LensPhoto
  }
  /**
   * No local photo: the files are already deleted by the time this mounts (see `LensAnalyzing`'s
   * sweep). A results thumbnail would need the *cropped* file kept alive past the upload -- the
   * original isn't what the search saw.
   */
  LensResults: {
    s3Bucket: string
    s3Key: string
  }
}
