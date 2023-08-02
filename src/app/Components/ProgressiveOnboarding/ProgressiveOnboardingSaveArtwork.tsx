import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { ElementInView } from "app/utils/ElementInView"
// import { GlobalStore } from "app/store/GlobalStore"
// import { PROGRESSIVE_ONBOARDING_SAVE_ARTWORK } from "app/store/ProgressiveOnboardingModel"
import { useState } from "react"

export const ProgressiveOnboardingSaveArtwork: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(true)
  const [inView, setInView] = useState(false)
  // const { dismiss } = GlobalStore.actions.progressiveOnboarding
  // const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  // const visible = isDismissed(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK).status
  const isDisplayable = visible && inView

  const handleDismiss = () => {
    setInView(false)
    setVisible(false)
  }

  if (!isDisplayable) {
    if (!visible) {
      return <>{children}</>
    }

    return <ElementInView onVisible={() => setInView(true)}>{children}</ElementInView>
  }

  return (
    <Popover
      visible={visible}
      // onDismiss={() => dismiss({ key: "save-artwork" })}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      title={
        <Text weight="medium" color="white100">
          Like what you see?
        </Text>
      }
      content={<Text color="white100">Hit the heart to save an artwork.</Text>}
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
