import { Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { SELL_STEPS, SellStepName } from "app/Scenes/Sell/sellSteps"
import { SellChannel } from "app/Scenes/Sell/utils/getSellChannel"

interface SellStepIntroProps extends FlexProps {
  stepName: SellStepName
  channelKind?: SellChannel["kind"]
  description?: string
}

export const SellStepIntro: React.FC<SellStepIntroProps> = ({
  stepName,
  channelKind,
  description,
  ...flexProps
}) => {
  const stepIndex = SELL_STEPS.findIndex((step) => step.name === stepName)
  const step = SELL_STEPS[stepIndex]
  const text = (channelKind === "AUCTION" && step.auction) || step

  return (
    <Flex gap={1} pt={1} pb={2} {...flexProps}>
      <Text variant="sm-display" weight="medium" color="blue100">
        {`Step ${stepIndex + 1} · ${text.title}`}
      </Text>

      <Text variant="sm" color="mono60">
        {description ?? text.description}
      </Text>
    </Flex>
  )
}
