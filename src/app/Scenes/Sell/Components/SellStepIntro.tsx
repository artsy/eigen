import { Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { SELL_STEPS, SellStepName } from "app/Scenes/Sell/sellSteps"

interface SellStepIntroProps extends FlexProps {
  stepName: SellStepName
  title?: string
  description?: string
}

export const SellStepIntro: React.FC<SellStepIntroProps> = ({
  stepName,
  title,
  description,
  ...flexProps
}) => {
  const stepIndex = SELL_STEPS.findIndex((step) => step.name === stepName)
  const step = SELL_STEPS[stepIndex]

  return (
    <Flex gap={1} pt={1} pb={2} {...flexProps}>
      <Text variant="sm-display" weight="medium" color="blue100">
        {`Step ${stepIndex + 1} · ${title ?? step.title}`}
      </Text>

      <Text variant="sm" color="mono60">
        {description ?? step.description}
      </Text>
    </Flex>
  )
}
