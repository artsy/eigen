import { Box, Image, ImageProps } from "@artsy/palette-mobile"

// Extend ImageProps but make `src` optional
type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null
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
        height={height ?? 250}
        backgroundColor="black10"
        borderRadius="md"
      />
    )
  }

  return <Image testID="image" {...props} src={src} width={width} height={height} />
}
