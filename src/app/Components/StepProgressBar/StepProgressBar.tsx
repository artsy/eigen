import { CheckmarkFillIcon } from "@artsy/icons/native"
import { Flex, ProgressBar } from "@artsy/palette-mobile"

interface StepProgressBarProps {
  current: number
  total: number
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ current, total }) => {
  const isComplete = current >= total
  const progress = (Math.min(current, total) / total) * 100

  return (
    <Flex flexDirection="row" alignItems="center" gap={1} width="100%">
      <ProgressBar
        height={4}
        trackColor={isComplete ? "green100" : "blue100"}
        progress={progress}
        style={{ flex: 1, borderRadius: 4 }}
        progressBarStyle={{ borderRadius: 4 }}
      />
      {!!isComplete && <CheckmarkFillIcon testID="step-progress-bar-checkmark" fill="green100" />}
    </Flex>
  )
}
