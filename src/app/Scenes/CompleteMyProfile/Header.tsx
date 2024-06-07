import { Flex, ProgressBar, Text, Touchable } from "@artsy/palette-mobile"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"

export const Header = () => {
  const { progress, currentStep, lastStep, saveAndExit } = useCompleteProfile()

  return (
    <Flex>
      <Flex py={1} justifyContent="space-between" flexDirection="row">
        <Text variant="xs">{`${currentStep} of ${lastStep}`}</Text>

        <Touchable onPress={saveAndExit}>
          <Text variant="xs">Save & Exit</Text>
        </Touchable>
      </Flex>
      <ProgressBar
        height={4}
        trackColor="blue100"
        progress={progress}
        progressBarStyle={{ borderRadius: 4 }}
      />
    </Flex>
  )
}
