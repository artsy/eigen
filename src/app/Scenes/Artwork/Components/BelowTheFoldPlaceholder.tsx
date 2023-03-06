import { Spacer } from "@artsy/palette-mobile"
import {
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"
import { ActivityIndicator } from "react-native"

const ContentPlaceholder = () => {
  return (
    <>
      <PlaceholderText width={120} height={20} />
      <Spacer y={2} />
      <PlaceholderRaggedText numLines={5} />
    </>
  )
}

export const BelowTheFoldPlaceholder = () => {
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
