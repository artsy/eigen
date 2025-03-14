import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { ProgressiveOnboardingSaveArtwork_Query } from "__generated__/ProgressiveOnboardingSaveArtwork_Query.graphql"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { Sentinel } from "app/utils/Sentinel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ProgressiveOnboardingSaveArtwork: React.FC<{ contextScreenOwnerType?: OwnerType }> = ({
  children,
}) => {
  const [isInView, setIsInView] = useState(false)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed: _isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const data = useLazyLoadQuery<ProgressiveOnboardingSaveArtwork_Query>(query, {})
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "save-artwork",
    contextModule: ContextModule.saveWorksCTA,
  })

  const savedArtworks = data?.me.counts.savedArtworks
  const isDismissed = _isDismissed("save-artwork").status
  const isDisplayable = isReady && !isDismissed && savedArtworks === 0 && isInView

  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("save-artwork")
  }

  const isVisible = !!isDisplayable && isActive

  // all conditions met we show the popover
  if (isVisible) {
    const content = (
      <Text color="white100">
        {isPartnerOfferEnabled
          ? "Tap the heart to save an artwork\nand signal your interest to galleries."
          : "Hit the heart to save an artwork."}
      </Text>
    )

    return (
      <Popover
        visible={isVisible}
        onDismiss={handleDismiss}
        onPressOutside={handleDismiss}
        onCloseComplete={clearActivePopover}
        onOpenComplete={trackEvent}
        title={
          <Text weight="medium" color="white100">
            Like what you see?
          </Text>
        }
        content={content}
      >
        <Flex>{children}</Flex>
      </Popover>
    )
  }

  // if the artwork element is shown but no conditions met displays only the children
  if (isInView) {
    return <>{children}</>
  }

  // no conditions met and children is not visible in the screen yet
  return (
    <Sentinel
      onChange={(visible) => {
        if (visible) {
          setIsInView(true)
        }
      }}
    >
      {children}
    </Sentinel>
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
