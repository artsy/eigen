import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text, THEMES } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_ART_ASSISTANT } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { ALWAYS_WHITE } from "app/utils/colors"
import { useState } from "react"

// The tooltip design uses the same dark Beta pill in both app themes.
const BETA_BADGE_BACKGROUND_COLOR = THEMES.v3dark.colors.mono10

export const ProgressiveOnboardingArtAssistant: React.FC<
  React.PropsWithChildren<{ isSearchOverlayVisible: boolean }>
> = ({ children, isSearchOverlayVisible }) => {
  const [isInView, setIsInView] = useState(false)
  const isFocused = useIsFocused()
  const {
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_ART_ASSISTANT}
      when={!!isReady && !!isFocused && !!isInView && !isSearchOverlayVisible}
      delay={500}
      placement="bottom"
      title={
        <Flex flexDirection="row" alignItems="center">
          <Text variant="xs" color="mono0" weight="medium">
            Art Assistant
          </Text>
          <Flex
            borderRadius={15}
            ml={0.5}
            px={1}
            py={0.5}
            style={{ backgroundColor: BETA_BADGE_BACKGROUND_COLOR }}
          >
            <Text variant="xxs" color={ALWAYS_WHITE}>
              Beta
            </Text>
          </Flex>
        </Flex>
      }
      content="Describe what you want and we'll find it"
      contextScreenOwnerType={OwnerType.search}
      contextModule={ContextModule.header}
    >
      <Flex>
        <Sentinel onChange={(visible) => visible && setIsInView(true)}>{children}</Sentinel>
      </Flex>
    </OnboardingPopover>
  )
}
