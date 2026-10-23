import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { useState } from "react"

interface Props {
  onboardingKey: ProgressiveOnboardingKey
  title: string
  description: string
  placement: "top" | "bottom"
  contextModule: ContextModule
}

export const ProgressiveOnboardingCityGuide: React.FC<React.PropsWithChildren<Props>> = ({
  onboardingKey,
  title,
  description,
  placement,
  contextModule,
  children,
}) => {
  const [isInView, setIsInView] = useState(false)
  const {
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()

  return (
    <OnboardingPopover
      id={onboardingKey}
      when={!!isReady && !!isFocused && isInView}
      delay={500}
      placement={placement}
      title={title}
      content={description}
      contextScreenOwnerType={OwnerType.cityGuide}
      contextModule={contextModule}
    >
      <Flex>
        {/* The target can start below the fold, and the popover would point at nothing. */}
        <Sentinel onChange={setIsInView}>{children}</Sentinel>
      </Flex>
    </OnboardingPopover>
  )
}
