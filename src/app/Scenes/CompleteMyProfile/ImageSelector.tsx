import {
  Text,
  Flex,
  Touchable,
  Button,
  CheckCircleFillIcon,
  AddCircleIcon,
  Image,
  Skeleton,
  SkeletonBox,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ImageSelector_me$key } from "__generated__/ImageSelector_me.graphql"
import { ProgressState } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteMyProfileSteps } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { FC, useState } from "react"
import { graphql, useFragment } from "react-relay"

interface ImageSelectorProps {
  src?: ProgressState["iconUrl"]
  onImageSelect: (props: { localPath: string; geminiUrl: string }) => void
}

export const ImageSelector: FC<ImageSelectorProps> = ({ src, onImageSelect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { showActionSheetWithOptions } = useActionSheet()
  const { me } = useCompleteMyProfileSteps()
  const data = useFragment<ImageSelector_me$key>(fragment, me)

  if (!data) {
    return null
  }

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
      <Flex alignItems="center" gap={2}>
        <Flex alignItems="center">
          <Flex
            alignItems="center"
            justifyContent="center"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            border={displayInitials ? 1 : 0}
            borderColor="mono10"
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

            {!!displayInitials && <Text variant="lg-display">{data.initials}</Text>}
          </Flex>

          <Flex
            display={isLoading ? "none" : "flex"}
            position="absolute"
            bottom={ICON_SIZE / 4}
            right={ICON_SIZE / 4}
            width={ICON_SIZE}
            height={ICON_SIZE}
            backgroundColor="mono0"
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

const fragment = graphql`
  fragment ImageSelector_me on Me {
    initials @required(action: NONE)
  }
`

const AVATAR_SIZE = 124
const ICON_SIZE = 28
