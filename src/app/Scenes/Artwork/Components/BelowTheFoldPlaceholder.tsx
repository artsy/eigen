import { useFeatureFlag } from "app/store/GlobalStore"
import {
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"
import { Separator, Spacer } from "palette"
import { ActivityIndicator } from "react-native"

const CurrentBelowTheFoldPlaceholder = () => {
  return (
    <ProvidePlaceholderContext>
      <Separator />
      <Spacer mb={3} />
      {/* About the artwork title */}
      <PlaceholderText width={60} />
      <Spacer mb={2} />
      {/* About the artwork copy */}
      <PlaceholderRaggedText numLines={4} />
      <Spacer mb={3} />
      <Separator />
      <Spacer mb={3} />
      <ActivityIndicator />
      <Spacer mb={3} />
    </ProvidePlaceholderContext>
  )
}

const ContentPlaceholder = () => {
  return (
    <>
      <PlaceholderText width={120} height={20} />
      <Spacer mb={2} />
      <PlaceholderRaggedText numLines={5} />
    </>
  )
}

const RedesignedBelowTheFoldPlaceholder = () => {
  return (
    <ProvidePlaceholderContext>
      {/* Provenance section */}
      <ContentPlaceholder />

      <Spacer mt={3} />

      {/* Exhibition history */}
      <ContentPlaceholder />

      <Spacer mt={4} />
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
