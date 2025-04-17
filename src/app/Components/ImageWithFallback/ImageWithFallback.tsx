import { Box, Image, ImageProps } from "@artsy/palette-mobile"

// Extend ImageProps but make `src` optional, require height and width
type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null
  height: number
  width: number
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  width,
  height,
  ...props
}) => {
  if (!src) {
    return (
      <Box
        testID="fallback-image"
        width={width}
        height={height}
        backgroundColor="mono10"
        borderRadius="md"
      />
    )
  }

  return <Image testID="image" {...props} src={src} width={width} height={height} />
}
