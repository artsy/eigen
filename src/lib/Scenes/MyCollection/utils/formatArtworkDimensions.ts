type Dimension = string | number | null

interface Props {
  height: Dimension
  width: Dimension
  depth: Dimension
  metric: "in" | "cm" | string | null
}

export function formatArtworkDimensions({ height, width, depth, metric }: Props): string | null {
  const hasValues = [height, width, depth, metric].every(Boolean)
  if (!hasValues) {
    return null
  }

  const dimensions = [height, width, depth].filter(Boolean).join(" × ") + " " + metric
  return dimensions
}
