import {
  Button,
  Flex,
  Screen,
  Spacer,
  Text,
  useSpace,
  CheckCircleFillIcon,
  CheckCircleIcon,
} from "@artsy/palette-mobile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"

export const ChangesSummary: FC = () => {
  const space = useSpace()
  const { saveAndExit } = useCompleteProfile()
  const isLoading = CompleteMyProfileStore.useStoreState((state) => state.isLoading)
  const steps = CompleteMyProfileStore.useStoreState((state) => state.steps)
  const progressState = CompleteMyProfileStore.useStoreState((state) => state.progressState)
  const progressStateWithoutUndefined = CompleteMyProfileStore.useStoreState(
    (state) => state.progressStateWithoutUndefined
  )

  const handleAddArtistsToMyCollection = () => {
    if (!isLoading) {
      navigate(`my-collection/collected-artists/new`)
    }
  }

  const completedStepsLength = Object.values(progressStateWithoutUndefined).length
  const isCompleted = completedStepsLength === steps.length - 1
  const hasLocation = !!progressState.location
  const hasProfession = !!progressState.profession
  const hasIconUrl = !!progressState.iconUrl
  const hasIsIdentityVerified = !!progressState.isIdentityVerified

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2}>
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

          <Button onPress={handleAddArtistsToMyCollection} flex={1} variant="outline">
            Add Artists to My Collection
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
