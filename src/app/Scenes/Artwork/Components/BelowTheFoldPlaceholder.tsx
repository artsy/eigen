import { Spacer } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/store/GlobalStore"
import {
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"
import { Separator } from "palette"
import { ActivityIndicator } from "react-native"

const CurrentBelowTheFoldPlaceholder = () => {
  return (
    <ProvidePlaceholderContext>
      <Separator />
      <Spacer y={4} />
      {/* About the artwork title */}
      <PlaceholderText width={60} />
      <Spacer y={2} />
      {/* About the artwork copy */}
      <PlaceholderRaggedText numLines={4} />
      <Spacer y={4} />
      <Separator />
      <Spacer y={4} />
      <ActivityIndicator />
      <Spacer y={4} />
    </ProvidePlaceholderContext>
  )
}

const ContentPlaceholder = () => {
  return (
    <>
      <PlaceholderText width={120} height={20} />
      <Spacer y={2} />
      <PlaceholderRaggedText numLines={5} />
    </>
  )
}

const RedesignedBelowTheFoldPlaceholder = () => {
  return (
    <ProvidePlaceholderContext>
      {/* Provenance section */}
      <ContentPlaceholder />

      <Spacer y={4} />

      {/* Exhibition history */}
      <ContentPlaceholder />

      <Spacer y={4} />
      <ActivityIndicator />
    </ProvidePlaceholderContext>
  )
}

export const BelowTheFoldPlaceholder = () => {
  const enableArtworkRedesign = useFeatureFlag("ARArtworkRedesingPhase2")

  if (enableArtworkRedesign) {
    return <RedesignedBelowTheFoldPlaceholder />
  }

  return <CurrentBelowTheFoldPlaceholder />
}
