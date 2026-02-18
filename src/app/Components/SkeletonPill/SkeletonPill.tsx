import { SkeletonBox } from "@artsy/palette-mobile"
import { PixelRatio } from "react-native"

export const SkeletonPill = () => {
  return (
    <SkeletonBox
      width={200 + Math.random() * 100}
      height={PixelRatio.getFontScale() * 40}
      mr={1}
      borderColor="mono60"
      borderRadius={20}
    />
  )
}
