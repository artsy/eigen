import {
  CloseIcon,
  Flex,
  ProgressBar,
  Skeleton,
  SkeletonBox,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import {
  ICON_SIZE,
  IMAGE_SIZE,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { Photo as TPhoto } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { Image } from "react-native"

interface PhotoProps {
  hideDeleteButton?: boolean
  onPhotoDelete: (arg: TPhoto) => void
  photo: TPhoto
  progress: number
}

export const PhotoItem = ({
  hideDeleteButton = false,
  onPhotoDelete,
  photo,
  progress,
}: PhotoProps) => {
  const space = useSpace()

  if (photo.loading) {
    return (
      <Skeleton>
        <SkeletonBox height={IMAGE_SIZE} width={IMAGE_SIZE} mt={1}>
          <Flex height={IMAGE_SIZE} width={IMAGE_SIZE} justifyContent="flex-end">
            {!!photo.path && (
              <Image
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                  position: "absolute",
                  opacity: 0.3,
                }}
                resizeMode="cover"
                source={{ uri: photo.path }}
                testID="Submission_Image"
              />
            )}

            <Flex>
              <ProgressBar
                progress={progress * 100}
                style={{
                  marginVertical: 0,
                  height: 2,
                }}
              />
            </Flex>
          </Flex>
        </SkeletonBox>
      </Skeleton>
    )
  }

  return (
    <Flex height={IMAGE_SIZE} width={IMAGE_SIZE} mt={1} justifyContent="flex-end">
      {photo.path ? (
        <Image
          style={{
            height: IMAGE_SIZE,
            width: IMAGE_SIZE,
            position: "absolute",
          }}
          resizeMode="cover"
          source={{ uri: photo.path }}
          testID="Submission_Image"
        />
      ) : (
        <SkeletonBox height={IMAGE_SIZE} width={IMAGE_SIZE}></SkeletonBox>
      )}
      {!hideDeleteButton && (
        <Flex
          height={ICON_SIZE}
          width={ICON_SIZE}
          backgroundColor="black100"
          borderRadius={ICON_SIZE / 2}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          right={0.5}
          top={0.5}
          zIndex={1000}
          hitSlop={{ top: space(0.5), right: space(0.5), bottom: space(0.5), left: space(0.5) }}
          testID="Submission_Delete_Photo_Button"
        >
          <Touchable
            onPress={() => onPhotoDelete(photo)}
            haptic="impactHeavy"
            hitSlop={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
          >
            <CloseIcon height={16} width={16} fill="white100" />
          </Touchable>
        </Flex>
      )}
      {!!photo.error && !!photo.errorMessage && (
        <Flex
          height={IMAGE_SIZE}
          width={IMAGE_SIZE}
          backgroundColor="rgba(255, 255, 255, 0.7)"
          justifyContent="flex-end"
          p={0.5}
        >
          <Text
            color="red100"
            style={{
              zIndex: 900,
              fontSize: 11,
              lineHeight: 14,
            }}
          >
            {photo.errorMessage}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
