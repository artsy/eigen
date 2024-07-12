import { Text, Screen, Spacer, Flex } from "@artsy/palette-mobile"
import { ProgressState } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { ImageSelector } from "app/Scenes/CompleteMyProfile/ImageSelector"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC } from "react"

export const AvatarStep: FC = () => {
  const { goNext, isCurrentRouteDirty, setField, field } =
    useCompleteProfile<ProgressState["iconUrl"]>()

  const handleOnImageSelect = ({
    localPath,
    geminiUrl,
  }: {
    localPath: string
    geminiUrl: string
  }) => {
    setField({ localPath, geminiUrl })
  }

  return (
    <Screen>
      <Screen.Body>
        <Flex justifyContent="space-between" height="100%">
          <Flex>
            <Text variant="lg">Add a profile image</Text>

            <Spacer y={1} />

            <Text color="black60">
              Make your profile more engaging and help foster trust with galleries on Artsy.
            </Text>

            <Spacer y={2} />

            <ImageSelector onImageSelect={handleOnImageSelect} src={field} />
          </Flex>

          <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
