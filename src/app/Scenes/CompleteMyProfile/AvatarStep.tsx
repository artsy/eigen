import { Text, Screen, Spacer, Flex } from "@artsy/palette-mobile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { ImageSelector } from "app/Scenes/CompleteMyProfile/ImageSelector"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC } from "react"

export const AvatarStep: FC = () => {
  const { goNext } = useCompleteProfile()
  const iconUrl = CompleteMyProfileStore.useStoreState((state) => state.progressState.iconUrl)
  const setProgressState = CompleteMyProfileStore.useStoreActions(
    (actions) => actions.setProgressState
  )

  const handleOnImageSelect = ({
    localPath,
    geminiUrl,
  }: {
    localPath: string
    geminiUrl: string
  }) => {
    setProgressState({ type: "iconUrl", value: { localPath, geminiUrl } })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2} fullwidth disableKeyboardAvoidance>
        <Flex justifyContent="space-between" height="100%">
          <Flex px={2}>
            <Text variant="lg">Add a profile image</Text>

            <Spacer y={1} />

            <Text color="mono60">
              Make your profile more engaging and help foster trust with galleries on Artsy.
            </Text>

            <Spacer y={2} />

            <ImageSelector onImageSelect={handleOnImageSelect} src={iconUrl} />
          </Flex>

          <Footer isFormDirty={!!iconUrl} onGoNext={goNext} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
