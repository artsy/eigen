import { isPad } from "app/utils/hardware"
import { findRelayRecord, findRelayRecordByDataID } from "app/utils/relayHelpers"
import { useSpace } from "palette"
import { Record } from "relay-runtime/lib/store/RelayStoreTypes"
import { ScreenDimensionsWithSafeAreas, useScreenDimensions } from "shared/hooks"
import { getMeasurements } from "./Components/ImageCarousel/geometry"

export const getDefaultImageDimensions = (
  screenDimensions: ScreenDimensionsWithSafeAreas,
  space: number
) => {
  // The logic for artworkHeight comes from the zeplin spec https://zpl.io/25JLX0Q
  return {
    width: (screenDimensions.width >= 375 ? 340 : 290) - space,
    height: screenDimensions.width,
  }
}

export const getImageDimensionsByImage = (
  screenDimensions: ScreenDimensionsWithSafeAreas,
  image: { width?: number; height?: number; aspectRatio?: number }
) => {
  const boundingBox = {
    width: screenDimensions.width,
    height: isPad() ? 460 : screenDimensions.width >= 375 ? 340 : 290,
  }

  const imageSize = {
    width: (image.width as number) || 1000 * (image.aspectRatio as number),
    height: (image.height as number) || 1000,
  }

  const measurements = getMeasurements({ images: [imageSize], boundingBox })

  return {
    width: measurements[0].width,
    height: measurements[0].height,
  }
}

export const useImagePlaceholderDimensions = (artworkID?: string) => {
  const space = useSpace()
  const screenDimensions = useScreenDimensions()

  // Try to find the image for the artwork in the Relay store
  const artwork = findRelayRecord("slug", artworkID)
  const imageRef = (artwork?.image as Record)?.__ref as string
  const image = findRelayRecordByDataID(imageRef)

  const hasImageBeenFound = !!(image?.width && image?.height) || !!image?.aspectRatio

  // Calculate the dimensions of the image
  const { width, height } = hasImageBeenFound
    ? getImageDimensionsByImage(screenDimensions, image)
    : getDefaultImageDimensions(screenDimensions, space(1))

  return { width, height }
}
