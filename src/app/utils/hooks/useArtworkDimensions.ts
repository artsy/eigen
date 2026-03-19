import { GlobalStore } from "app/store/GlobalStore"
import { useMemo } from "react"
import { useFeatureFlag } from "./useFeatureFlag"

export interface Dimensions {
  in?: string | null
  cm?: string | null
}

export type DimensionFormat = "both-metrics" | "preferred-metric"

export interface UseArtworkDimensionsOptions {
  dimensions?: Dimensions | null
  framedDimensions?: Dimensions | null
  format?: DimensionFormat
  includeFrameText?: boolean
}

export interface UseArtworkDimensionsResult {
  /**
   * Formatted dimension text based on the format option
   */
  dimensionText: string | null
  /**
   * Whether framed dimensions are being used
   */
  isUsingFramedDimensions: boolean
  /**
   * Whether framed dimensions are available
   */
  hasFramedDimensions: boolean
  /**
   * Whether the feature flag is enabled
   */
  isFramedSizeEnabled: boolean
  /**
   * Regular dimensions (for separate display)
   */
  regularDimensionText: string | null
  /**
   * Framed dimensions (for separate display)
   */
  framedDimensionText: string | null
}

export const dimensionsPresent = (dimensions: Dimensions | null | undefined): boolean => {
  if (!dimensions) return false
  return /\d/.test(dimensions.in || "") || /\d/.test(dimensions.cm || "")
}

/**
 * Hook for handling artwork dimensions with support for framed dimensions
 *
 * @param options - Configuration options
 * @param options.dimensions - Regular artwork dimensions
 * @param options.framedDimensions - Framed artwork dimensions
 * @param options.format - Format type: 'both-metrics' (default) or 'preferred-metric'
 * @param options.includeFrameText - Whether to append "with frame included" text (default: false)
 *
 * @returns Object containing formatted dimension text and related flags
 *
 * @example
 * // Display with both metrics
 * const { dimensionText } = useArtworkDimensions({
 *   dimensions: { in: "10 in", cm: "25 cm" },
 *   framedDimensions: { in: "12 in", cm: "30 cm" },
 *   format: "both-metrics",
 *   includeFrameText: true
 * })
 * // Returns: "12 in | 30 cm with frame included"
 *
 * @example
 * // Display with user-preferred metric
 * const { dimensionText } = useArtworkDimensions({
 *   dimensions: { in: "10 in", cm: "25 cm" },
 *   framedDimensions: { in: "12 in", cm: "30 cm" },
 *   format: "preferred-metric",
 *   includeFrameText: true
 * })
 * // Returns: "30 cm with frame included" (if user preference is cm)
 *
 * @example
 * // Display size and framed size separately
 * const { regularDimensionText, framedDimensionText, hasFramedDimensions } = useArtworkDimensions({
 *   dimensions: { in: "10 in", cm: "25 cm" },
 *   framedDimensions: { in: "12 in", cm: "30 cm" },
 *   format: "both-metrics"
 * })
 * // regularDimensionText: "10 in | 25 cm"
 * // framedDimensionText: "12 in | 30 cm"
 */
export const useArtworkDimensions = ({
  dimensions,
  framedDimensions,
  format = "both-metrics",
  includeFrameText = false,
}: UseArtworkDimensionsOptions) => {
  const enableFramedSize = useFeatureFlag("AREnableArtworksFramedSize")
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const hasFramedDimensions = dimensionsPresent(framedDimensions)
  const isUsingFramedDimensions = enableFramedSize && hasFramedDimensions

  const formatDimensions = (dims?: Dimensions | null, addFrameText = false) => {
    if (!dimensionsPresent(dims)) {
      return null
    }

    if (format === "both-metrics") {
      const inValue = dims?.in
      const cmValue = dims?.cm

      if (inValue && cmValue) {
        const baseText = `${inValue} | ${cmValue}`
        return addFrameText ? `${baseText} with frame included` : baseText
      }

      const singleMetric = inValue || cmValue
      return addFrameText && singleMetric
        ? `${singleMetric} with frame included`
        : singleMetric || null
    }

    if (format === "preferred-metric") {
      let dimensionValue = ""

      if (preferredMetric === "cm" && dims?.cm) {
        dimensionValue = dims.cm
      } else if (preferredMetric === "in" && dims?.in) {
        dimensionValue = dims.in
      } else {
        dimensionValue = dims?.cm || dims?.in || ""
      }

      if (!dimensionValue) {
        return null
      }

      return addFrameText ? `${dimensionValue} with frame included` : dimensionValue
    }

    return null
  }

  const regularDimensionText = useMemo(
    () => formatDimensions(dimensions, false),
    [dimensions, format, preferredMetric]
  )

  const framedDimensionText = useMemo(
    () => formatDimensions(framedDimensions, includeFrameText),
    [framedDimensions, format, preferredMetric, includeFrameText]
  )

  const dimensionText = useMemo(() => {
    if (isUsingFramedDimensions) {
      return framedDimensionText
    }
    return regularDimensionText
  }, [isUsingFramedDimensions, framedDimensionText, regularDimensionText])

  return {
    dimensionText,
    isUsingFramedDimensions,
    hasFramedDimensions,
    isFramedSizeEnabled: enableFramedSize,
    regularDimensionText,
    framedDimensionText,
  }
}
