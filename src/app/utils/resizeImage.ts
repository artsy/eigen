import ImageResizer, { ResizeFormat, ResizeMode } from "react-native-image-resizer"

interface ResizeImageOptions {
  uri: string
  width: number
  height: number
  outputformat?: ResizeFormat
  quality?: number
  rotation?: number
  outputPath?: string
  keepMeta?: boolean
  onlyScaleDown?: boolean
  mode?: ResizeMode
}

export const resizeImage = (options: ResizeImageOptions) => {
  const {
    uri,
    width,
    height,
    outputformat = "JPEG",
    quality = 100,
    rotation = 0,
    outputPath,
    keepMeta,
    onlyScaleDown,
    mode = "contain",
  } = options

  return ImageResizer.createResizedImage(
    uri,
    width,
    height,
    outputformat,
    quality,
    rotation,
    outputPath,
    keepMeta,
    {
      mode,
      onlyScaleDown,
    }
  )
}
