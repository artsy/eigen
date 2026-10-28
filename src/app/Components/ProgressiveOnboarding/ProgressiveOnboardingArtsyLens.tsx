import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { getCurrentEmissionState, GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_ARTSY_LENS } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { useState } from "react"

export const ProgressiveOnboardingArtsyLens: React.FC<
  React.PropsWithChildren<{
    isSearchOverlayVisible: boolean
    ownerType: ScreenOwnerType
  }>
> = ({ children, isSearchOverlayVisible, ownerType }) => {
  const [isInView, setIsInView] = useState(false)
  const isFocused = useIsFocused()
  const { launchCount } = getCurrentEmissionState()
  const {
    sessionState: { isReady, deferHomeTooltipsThisSession },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_ARTSY_LENS}
      when={
        launchCount >= 3 &&
        !!isReady &&
        !!isFocused &&
        !!isInView &&
        !isSearchOverlayVisible &&
        !(ownerType === OwnerType.home && deferHomeTooltipsThisSession)
      }
      delay={500}
      placement="bottom"
      title="Artsy Lens"
      content="Take a picture of a work to find more like it"
      contextScreenOwnerType={ownerType}
      contextModule={ContextModule.header}
    >
      <Flex>
        <Sentinel onChange={(visible) => visible && setIsInView(true)}>{children}</Sentinel>
      </Flex>
    </OnboardingPopover>
  )
}
