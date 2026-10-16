import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { ProgressiveOnboardingSaveArtwork_Query } from "__generated__/ProgressiveOnboardingSaveArtwork_Query.graphql"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_SAVE_ARTWORK } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ProgressiveOnboardingSaveArtwork: React.FC<
  React.PropsWithChildren<{ contextScreenOwnerType?: OwnerType }>
> = ({ children, contextScreenOwnerType }) => {
  const [isInView, setIsInView] = useState(false)
  const {
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const data = useLazyLoadQuery<ProgressiveOnboardingSaveArtwork_Query>(query, {})
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  const savedArtworks = data?.me.counts.savedArtworks

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_SAVE_ARTWORK}
      when={!!isReady && savedArtworks === 0 && isInView}
      delay={200}
      title={
        <Text weight="medium" color="mono0">
          Like what you see?
        </Text>
      }
      content={
        <Text color="mono0">
          {isPartnerOfferEnabled
            ? "Tap the heart to save an artwork\nand signal your interest to galleries."
            : "Hit the heart to save an artwork."}
        </Text>
      }
      contextScreenOwnerType={contextScreenOwnerType}
      contextModule={ContextModule.saveWorksCTA}
    >
      <Flex>
        <Sentinel onChange={setIsInView}>{children}</Sentinel>
      </Flex>
    </OnboardingPopover>
  )
}

const query = graphql`
  query ProgressiveOnboardingSaveArtwork_Query {
    me @required(action: NONE) {
      counts @required(action: NONE) {
        savedArtworks
      }
    }
  }
`
