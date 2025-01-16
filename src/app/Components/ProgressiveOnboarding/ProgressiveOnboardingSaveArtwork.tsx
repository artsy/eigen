import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { ProgressiveOnboardingSaveArtwork_Query } from "__generated__/ProgressiveOnboardingSaveArtwork_Query.graphql"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { ElementInView } from "app/utils/ElementInView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ProgressiveOnboardingSaveArtwork: React.FC = ({ children }) => {
  const [isInView, setIsInView] = useState(false)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed: _isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const data = useLazyLoadQuery<ProgressiveOnboardingSaveArtwork_Query>(query, {})

  const savedArtworks = data?.me.counts.savedArtworks
  const isDismissed = _isDismissed("save-artwork").status
  /**
   *  we might not need the && savedArtworks === 0 check here because we have useDismissSavedArtwork()
   * hook that is being calld on the homeview
   */
  const isDisplayable = isReady && !isDismissed && savedArtworks === 0 && isInView

  const { clearActivePopover } = useSetActivePopover(isDisplayable)

  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("save-artwork")
  }

  // all conditions met we show the popover
  if (isDisplayable) {
    return (
      <Popover
        visible={isDisplayable}
        onDismiss={handleDismiss}
        onPressOutside={handleDismiss}
        onCloseComplete={clearActivePopover}
        title={
          <Text weight="medium" color="white100">
            Like what you see?
          </Text>
        }
        content={
          <Text color="white100">
            {isPartnerOfferEnabled
              ? "Tap the heart to save an artwork\nand signal your interest to galleries."
              : "Hit the heart to save an artwork."}
          </Text>
        }
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
  return <ElementInView onVisible={() => setIsInView(true)}>{children}</ElementInView>
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
