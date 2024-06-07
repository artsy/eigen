import {
  Button,
  Flex,
  ProgressBar,
  Screen,
  Spacer,
  Text,
  Touchable,
  useSpace,
  CheckCircleFillIcon,
  CheckCircleIcon,
} from "@artsy/palette-mobile"
import { useCompleteMyProfileContext } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { navigate } from "app/system/navigation/navigate"

export const ChangesSummary = () => {
  const space = useSpace()
  const { goBack, saveAndExit, isLoading } = useCompleteProfile()
  const { progressState, progressStateWithoutUndefined, steps } = useCompleteMyProfileContext()

  const completedStepsLength = Object.values(progressStateWithoutUndefined).length
  const isCompleted = completedStepsLength === steps.length - 1
  const hasLocation = !!progressState.location
  const hasProfession = !!progressState.profession
  const hasIconUrl = !!progressState.iconUrl
  const hasIsIdentityVerified = !!progressState.isIdentityVerified

  return (
    <Screen>
      <Screen.Body>
        <Flex py={1}>
          <Touchable onPress={goBack}>
            <Text variant="xs">Back</Text>
          </Touchable>
        </Flex>

        <Flex flexDirection="row" alignItems="center" gap={space(1)}>
          <ProgressBar
            height={4}
            trackColor="green100"
            progress={(completedStepsLength / (steps.length - 1)) * 100}
            style={{ flex: 1, borderRadius: 4 }}
            progressBarStyle={{ borderRadius: 4 }}
          />

          <Flex>
            {isCompleted ? (
              <CheckCircleFillIcon fill="green100" />
            ) : (
              <CheckCircleIcon fill="black60" />
            )}
          </Flex>
        </Flex>

        <Flex py={2} gap={space(2)}>
          <Text variant="lg-display">
            {isCompleted ? "Thank you for completing your profile." : "You’re almost there!"}
          </Text>

          <Text color="black60" variant="sm">
            {isCompleted ? (
              <>
                You can update your profile at any time in{" "}
                <Text
                  variant="sm"
                  backgroundColor="white100"
                  style={{ textDecorationLine: "underline" }}
                  onPress={() => navigate(`my-profile/edit`)}
                  suppressHighlighting
                >{` Settings`}</Text>
                .
              </>
            ) : (
              "Complete these details to finalize your profile:"
            )}
          </Text>

          <Flex gap={space(1)}>
            {steps.includes("LocationStep") && (
              <Flex flexDirection="row" alignItems="center" gap={space(1)}>
                {hasLocation ? (
                  <CheckCircleFillIcon fill="green100" />
                ) : (
                  <CheckCircleIcon fill="black60" />
                )}
                <Text variant="md" color={hasLocation ? "black100" : "black60"}>
                  Location
                </Text>
              </Flex>
            )}

            {steps.includes("ProfessionStep") && (
              <Flex flexDirection="row" alignItems="center" gap={space(1)}>
                {hasProfession ? (
                  <CheckCircleFillIcon fill="green100" />
                ) : (
                  <CheckCircleIcon fill="black60" />
                )}
                <Text variant="md" color={hasProfession ? "black100" : "black60"}>
                  Profession
                </Text>
              </Flex>
            )}

            {steps.includes("AvatarStep") && (
              <Flex flexDirection="row" alignItems="center" gap={space(1)}>
                {hasIconUrl ? (
                  <CheckCircleFillIcon fill="green100" />
                ) : (
                  <CheckCircleIcon fill="black60" />
                )}
                <Text variant="md" color={hasIconUrl ? "black100" : "black60"}>
                  Profile Image
                </Text>
              </Flex>
            )}

            {steps.includes("IdentityVerificationStep") && (
              <Flex flexDirection="row" alignItems="center" gap={space(1)}>
                {hasIsIdentityVerified ? (
                  <CheckCircleFillIcon fill="green100" />
                ) : (
                  <CheckCircleIcon fill="black60" />
                )}
                <Text variant="md" color={hasIsIdentityVerified ? "black100" : "black60"}>
                  ID Verification Email
                </Text>
              </Flex>
            )}
          </Flex>

          <Text color="black60" variant="sm">
            {isCompleted ? (
              <>
                Continue building your profile by adding artists or artworks to{" "}
                <Text
                  variant="sm"
                  style={{ textDecorationLine: "underline" }}
                  onPress={() => navigate(`my-collection`)}
                  suppressHighlighting
                >{` My Collection`}</Text>
                .
              </>
            ) : (
              <>
                You can update your profile at any time in
                <Text
                  variant="sm"
                  style={{ textDecorationLine: "underline" }}
                  onPress={() => navigate(`my-profile/edit`)}
                  suppressHighlighting
                >{` Settings`}</Text>
                .
              </>
            )}
          </Text>
        </Flex>

        <Flex flex={1} justifyContent="flex-end" pb={4}>
          <Button onPress={saveAndExit} flex={1} loading={isLoading}>
            Save and Exit
          </Button>

          <Spacer y={2} />

          <Button
            onPress={() => navigate(`my-collection/collected-artists/new`, {})}
            flex={1}
            variant="outline"
            loading={isLoading}
          >
            Add Artists to My Collection
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
