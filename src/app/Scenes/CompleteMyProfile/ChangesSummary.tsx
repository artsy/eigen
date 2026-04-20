import { CheckmarkFillIcon, CheckmarkStrokeIcon } from "@artsy/icons/native"
import { Button, Flex, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"

export const ChangesSummary: FC = () => {
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
      <Screen.Body pt={2} disableKeyboardAvoidance>
        <Flex py={2} gap={2}>
          <Text variant="lg-display">
            {isCompleted ? "Thank you for completing your profile." : "You’re almost there!"}
          </Text>

          <Text color="mono60" variant="sm">
            {isCompleted ? (
              <>
                You can update your profile at any time in{" "}
                <Text
                  variant="sm"
                  backgroundColor="mono0"
                  style={{ textDecorationLine: "underline" }}
                  onPress={() => navigate(`my-profile/edit`)}
                  suppressHighlighting
                >
                  Settings
                </Text>
                .
              </>
            ) : (
              "Complete these details to finalize your profile:"
            )}
          </Text>

          <Flex gap={1}>
            {steps.includes("LocationStep") && (
              <Flex flexDirection="row" alignItems="center" gap={1}>
                {hasLocation ? (
                  <CheckmarkFillIcon fill="green100" />
                ) : (
                  <CheckmarkStrokeIcon fill="mono60" />
                )}
                <Text variant="md" color={hasLocation ? "mono100" : "mono60"}>
                  Location
                </Text>
              </Flex>
            )}

            {steps.includes("ProfessionStep") && (
              <Flex flexDirection="row" alignItems="center" gap={1}>
                {hasProfession ? (
                  <CheckmarkFillIcon fill="green100" />
                ) : (
                  <CheckmarkStrokeIcon fill="mono60" />
                )}
                <Text variant="md" color={hasProfession ? "mono100" : "mono60"}>
                  Profession
                </Text>
              </Flex>
            )}

            {steps.includes("AvatarStep") && (
              <Flex flexDirection="row" alignItems="center" gap={1}>
                {hasIconUrl ? (
                  <CheckmarkFillIcon fill="green100" />
                ) : (
                  <CheckmarkStrokeIcon fill="mono60" />
                )}
                <Text variant="md" color={hasIconUrl ? "mono100" : "mono60"}>
                  Profile Image
                </Text>
              </Flex>
            )}

            {steps.includes("IdentityVerificationStep") && (
              <Flex flexDirection="row" alignItems="center" gap={1}>
                {hasIsIdentityVerified ? (
                  <CheckmarkFillIcon fill="green100" />
                ) : (
                  <CheckmarkStrokeIcon fill="mono60" />
                )}
                <Text variant="md" color={hasIsIdentityVerified ? "mono100" : "mono60"}>
                  ID Verification Email
                </Text>
              </Flex>
            )}
          </Flex>

          <Text color="mono60" variant="sm">
            {isCompleted ? (
              <>
                Continue building your profile by adding artists or artworks to{" "}
                <Text
                  variant="sm"
                  style={{ textDecorationLine: "underline" }}
                  onPress={handleAddArtistsToMyCollection}
                  suppressHighlighting
                >
                  My Collection
                </Text>
                .
              </>
            ) : (
              <>
                You can update your profile at any time in{" "}
                <Text
                  variant="sm"
                  style={{ textDecorationLine: "underline" }}
                  onPress={() => navigate(`my-profile/edit`)}
                  suppressHighlighting
                >
                  Settings
                </Text>
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
