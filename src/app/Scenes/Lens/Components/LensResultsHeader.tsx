import { ChevronLeftIcon, FilterIcon } from "@artsy/icons/native"
import {
  bullet,
  Flex,
  Image,
  NAVBAR_HEIGHT,
  Separator,
  Text,
  Touchable,
  TouchableHighlightColor,
} from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

const THUMBNAIL_SIZE = 44

interface LensResultsHeaderProps {
  onBack: () => void
  photoUri: string
  title?: string
  /** Shows a Filter button at the end of the row when provided. */
  onFilterPress?: () => void
  selectedFiltersCount?: number
}

export const LensResultsHeader: React.FC<LensResultsHeaderProps> = ({
  onBack,
  photoUri,
  title,
  onFilterPress,
  selectedFiltersCount = 0,
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
            src={photoUri}
            width={THUMBNAIL_SIZE}
            height={THUMBNAIL_SIZE}
            resizeMode="cover"
            performResize={false}
          />
        </Flex>

        {!!title && (
          <Flex flex={1} ml={1}>
            <Text variant="sm-display" numberOfLines={3}>
              {title}
            </Text>
          </Flex>
        )}

        {!!onFilterPress && (
          <Flex ml={1}>
            <TouchableHighlightColor
              haptic
              onPress={onFilterPress}
              testID="lensResultsFilterButton"
              accessibilityRole="button"
              accessibilityLabel={
                selectedFiltersCount > 0 ? `Filter, ${selectedFiltersCount} applied` : "Filter"
              }
              hitSlop={ICON_HIT_SLOP}
              render={({ color }) => (
                <Flex flexDirection="row" alignItems="center">
                  <FilterIcon fill={color} width="20px" height="20px" />
                  <Text variant="xs" numberOfLines={1} color={color} ml={0.5}>
                    Filter
                  </Text>
                  {selectedFiltersCount > 0 && (
                    <Text variant="xs" color="blue100">
                      {` ${bullet} ${selectedFiltersCount}`}
                    </Text>
                  )}
                </Flex>
              )}
            />
          </Flex>
        )}
      </Flex>

      <Separator borderColor="mono5" />
    </Flex>
  )
}
