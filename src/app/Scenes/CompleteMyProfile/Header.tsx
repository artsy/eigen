import {
  CheckCircleFillIcon,
  CheckCircleIcon,
  Flex,
  ProgressBar,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import {
  CompleteMyProfileNavigationRoutes,
  Routes,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC } from "react"

export const Header: FC = () => {
  const space = useSpace()
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
    <Flex
      backgroundColor="white100"
      pb={1}
      style={{ paddingTop: safeAreaInsets.top, paddingHorizontal: space(2) }}
    >
      <Flex py={1} justifyContent="space-between" flexDirection="row">
        {!isChangesSummary ? (
          <Text variant="xs">{`${currentStep} of ${lastStep}`}</Text>
        ) : (
          <Touchable onPress={goBack}>
            <Text variant="xs">Back</Text>
          </Touchable>
        )}

        {!isChangesSummary && (
          <Touchable onPress={saveAndExit}>
            <Text variant="xs">Save & Exit</Text>
          </Touchable>
        )}
      </Flex>

      <Flex flexDirection="row" alignItems="center" gap={space(1)}>
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
              <CheckCircleFillIcon fill="green100" />
            ) : (
              <CheckCircleIcon fill="black60" />
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
