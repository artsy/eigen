import {
  Text,
  Screen,
  Spacer,
  Flex,
  Touchable,
  Button,
  CheckCircleFillIcon,
  AddCircleIcon,
  useSpace,
  Image,
  Skeleton,
  SkeletonBox,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import {
  State,
  useCompleteMyProfileContext,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { Header } from "app/Scenes/CompleteMyProfile/Header"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { FC, useState } from "react"

export const AvatarStep = () => {
  const { goNext, isCurrentRouteDirty, setField, field } = useCompleteProfile<State["iconUrl"]>()

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
        <Header />

        <Spacer y={2} />

        <Text variant="lg">Add a profile image</Text>

        <Spacer y={1} />

        <Text color="black60">
          Make your profile more engaging and help foster trust with galleries on Artsy.
        </Text>

        <Spacer y={2} />

        <ImageSelector onImageSelect={handleOnImageSelect} src={field} />

        <Footer isFormDirty={isCurrentRouteDirty} onGoNext={goNext} />
      </Screen.Body>
    </Screen>
  )
}

interface ImageSelectorProps {
  src?: State["iconUrl"]
  onImageSelect: (props: { localPath: string; geminiUrl: string }) => void
}

const ImageSelector: FC<ImageSelectorProps> = ({ src, onImageSelect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const space = useSpace()
  const { showActionSheetWithOptions } = useActionSheet()
  const { user } = useCompleteMyProfileContext()

  const handleImagePress = async () => {
    if (isLoading) {
      return
    }

    try {
      const images = await showPhotoActionSheet(showActionSheetWithOptions, true, false)

      if (images.length === 1) {
        setIsLoading(true)
        const localPath = images[0].path
        const geminiUrl = await getConvertedImageUrlFromS3(localPath)
        onImageSelect({ localPath, geminiUrl })
      }
    } catch (error) {
      console.error("Error when uploading an image from the device", JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  const displayAvatar = !isLoading && src?.localPath && src?.geminiUrl
  const displayInitials = !isLoading && !displayAvatar

  return (
    <Touchable aria-label="Choose a photo" accessibilityRole="button" onPress={handleImagePress}>
      <Flex alignItems="center" gap={space(2)}>
        <Flex alignItems="center">
          <Flex
            alignItems="center"
            justifyContent="center"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            border={displayInitials ? 1 : 0}
            borderColor="black10"
            borderRadius={AVATAR_SIZE / 2}
          >
            {!!isLoading && (
              <Skeleton>
                <SkeletonBox
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  borderRadius={AVATAR_SIZE / 2}
                />
              </Skeleton>
            )}

            {!!displayAvatar && (
              <Flex overflow="hidden" borderRadius={AVATAR_SIZE / 2}>
                <Image
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  performResize={false}
                  src={src.localPath}
                />
              </Flex>
            )}

            {!!displayInitials && <Text variant="lg-display">{user.initials}</Text>}
          </Flex>

          <Flex
            display={isLoading ? "none" : "flex"}
            position="absolute"
            bottom={ICON_SIZE / 4}
            right={ICON_SIZE / 4}
            width={ICON_SIZE}
            height={ICON_SIZE}
            backgroundColor="white100"
            borderRadius={ICON_SIZE / 2}
          >
            {!!displayAvatar && (
              <CheckCircleFillIcon width={ICON_SIZE} height={ICON_SIZE} fill="green100" />
            )}

            {!!displayInitials && <AddCircleIcon width={ICON_SIZE} height={ICON_SIZE} />}
          </Flex>
        </Flex>
        <Button variant="outline" size="small" onPress={handleImagePress} loading={isLoading}>
          {src ? "Change Image" : "Choose an Image"}
        </Button>
      </Flex>
    </Touchable>
  )
}

const AVATAR_SIZE = 124
const ICON_SIZE = 28
