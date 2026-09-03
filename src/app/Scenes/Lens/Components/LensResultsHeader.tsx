import { ChevronLeftIcon } from "@artsy/icons/native"
import { Flex, NAVBAR_HEIGHT, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { Image } from "react-native"

const THUMBNAIL_SIZE = 44

interface LensResultsHeaderProps {
  onBack: () => void
  photoUri: string
  title?: string
}

export const LensResultsHeader: React.FC<LensResultsHeaderProps> = ({
  onBack,
  photoUri,
  title,
}) => {
  return (
    <Flex>
      <Flex flexDirection="row" alignItems="center" px={2} py={1} minHeight={NAVBAR_HEIGHT}>
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint="Navigates to the previous screen"
          onPress={onBack}
          underlayColor="transparent"
          hitSlop={ICON_HIT_SLOP}
        >
          <ChevronLeftIcon fill="mono100" />
        </Touchable>

        <Flex ml={1} width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} bg="mono10" overflow="hidden">
          <Image
            testID="lensResultsPhotoThumbnail"
            source={{ uri: photoUri }}
            resizeMode="cover"
            style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          />
        </Flex>

        {!!title && (
          <Flex flex={1} ml={1}>
            <Text variant="sm-display" numberOfLines={3}>
              {title}
            </Text>
          </Flex>
        )}
      </Flex>

      <Separator borderColor="mono5" />
    </Flex>
  )
}
