export const calculateDynamicTriggerIndex = (artworkCount: number): number => {
  if (artworkCount <= 1) return 0
  if (artworkCount <= 2) return 0
  if (artworkCount <= 3) return 1
  return 2
}
