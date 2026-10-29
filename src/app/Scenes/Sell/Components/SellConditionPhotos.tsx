import { CloseFillIcon, UploadFileIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { Image } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"

export interface SellConditionPhoto {
  path: string
}

const PREVIEW_SIZE = 80
const REMOVE_TARGET_SIZE = 48

interface SellConditionPhotosProps {
  photos: SellConditionPhoto[]
  onAdd: (photos: SellConditionPhoto[]) => void
  onRemove: (path: string) => void
}

export const SellConditionPhotos: React.FC<SellConditionPhotosProps> = ({
  photos,
  onAdd,
  onRemove,
}) => {
  const { showActionSheetWithOptions } = useActionSheet()

  const pickPhotos = async () => {
    // iOS gives focus back to the notes input once the picker closes
    KeyboardController.dismiss()

    try {
      const images = await showPhotoActionSheet(showActionSheetWithOptions, true)
      onAdd(images.map((image) => ({ path: image.path })))
    } catch {
      // The picker rejects when the user cancels
    }
  }

  return (
    <Flex gap={1}>
      {photos.length > 0 && (
        <Flex flexDirection="row" flexWrap="wrap" gap={1}>
          {photos.map((photo, index) => (
            <Flex key={photo.path}>
              <Image
                accessibilityIgnoresInvertColors
                testID="sell-condition-photo"
                source={{ uri: photo.path }}
                style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
              />
              <Flex position="absolute" top={0} right={0}>
                <Touchable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove photo ${index + 1}`}
                  onPress={() => onRemove(photo.path)}
                >
                  {/* Android drops hitSlop outside the parent, so the target itself is 48pt */}
                  <Flex
                    width={REMOVE_TARGET_SIZE}
                    height={REMOVE_TARGET_SIZE}
                    alignItems="flex-end"
                    p={0.5}
                  >
                    <Flex bg="mono0" borderRadius={10}>
                      <CloseFillIcon fill="mono100" width={20} height={20} />
                    </Flex>
                  </Flex>
                </Touchable>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      <Touchable accessibilityRole="button" onPress={pickPhotos}>
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={1}
          py={2}
          borderWidth={1}
          borderColor="mono30"
          borderStyle="dashed"
        >
          <UploadFileIcon />
          <Text variant="sm">{photos.length > 0 ? "Add more photos" : "Upload photos"}</Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}
