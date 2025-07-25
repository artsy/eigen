import { CheckmarkFillIcon, CheckmarkStrokeIcon } from "@artsy/icons/native"
import { Flex, ProgressBar, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import {
  CompleteMyProfileNavigationRoutes,
  Routes,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC } from "react"

export const Header: FC = () => {
  const { progress, currentStep, lastStep, saveAndExit, goBack } = useCompleteProfile()
  const steps = CompleteMyProfileStore.useStoreState((state) => state.steps)
  const progressStateWithoutUndefined = CompleteMyProfileStore.useStoreState(
    (state) => state.progressStateWithoutUndefined
  )
  const { name } = useRoute<RouteProp<CompleteMyProfileNavigationRoutes, Routes>>()
  const { safeAreaInsets } = useScreenDimensions()

  const isChangesSummary = name === "ChangesSummary"
  const completedStepsLength = Object.values(progressStateWithoutUndefined).length
  const isCompleted = completedStepsLength === steps.length - 1

  return (
    <Flex backgroundColor="mono0" pb={1} px={2} style={{ paddingTop: safeAreaInsets.top }}>
      <Flex py={1} justifyContent="space-between" flexDirection="row">
        {!isChangesSummary ? (
          <Text variant="xs">{`${currentStep} of ${lastStep}`}</Text>
        ) : (
          <Touchable accessibilityRole="button" onPress={goBack}>
            <Text variant="xs">Back</Text>
          </Touchable>
        )}

        {!isChangesSummary && (
          <Touchable accessibilityRole="button" onPress={saveAndExit}>
            <Text variant="xs">Save & Exit</Text>
          </Touchable>
        )}
      </Flex>

      <Flex flexDirection="row" alignItems="center" gap={1}>
        <ProgressBar
          height={4}
          trackColor={!isCompleted && !isChangesSummary ? "blue100" : "green100"}
          progress={
            !isChangesSummary ? progress : (completedStepsLength / (steps.length - 1)) * 100
          }
          style={{ flex: 1, borderRadius: 4 }}
          progressBarStyle={{ borderRadius: 4 }}
        />
        {!!isChangesSummary && (
          <Flex>
            {isCompleted ? (
              <CheckmarkFillIcon fill="green100" />
            ) : (
              <CheckmarkStrokeIcon fill="mono60" />
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
