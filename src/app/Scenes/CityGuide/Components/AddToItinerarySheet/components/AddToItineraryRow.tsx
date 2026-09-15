import { CheckmarkStrokeIcon, EmptyCheckCircleIcon, NoArtIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { pluralize } from "app/utils/pluralize"
// TODO: Replace with Image from @artsy/palette-mobile once the itinerary hero is a real image.
import { Image as RNImage, TouchableOpacity } from "react-native"

const IMAGE_SIZE = 40
const TICK_SIZE = 26
const NO_ICON_SIZE = 20
/** The designs' selected border: 1px blue, radius 10. */
const ROW_RADIUS = 10

interface Props {
  title: string
  /** Omitted when nothing knows the count — see `itineraryStopsCount`. */
  stopsCount?: number
  imageUrl?: string | null
  selected: boolean
  onPress: () => void
}

/** One itinerary in the Add to Itinerary sheet, ticked when it holds this stop. */
export const AddToItineraryRow: React.FC<Props> = ({
  title,
  stopsCount,
  imageUrl,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      testID="add-to-itinerary-row"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={title}
      onPress={onPress}
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        gap={1}
        p={1}
        borderRadius={ROW_RADIUS}
        border="1px solid"
        // Unselected rows are borderless in the designs, but a transparent border keeps both
        // states the same height, so the list does not shift as you tick rows.
        borderColor={selected ? "blue100" : "transparent"}
      >
        {imageUrl ? (
          <RNImage
            testID="add-to-itinerary-row-image"
            source={{ uri: imageUrl }}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Flex
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            backgroundColor="mono10"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
          </Flex>
        )}

        <Flex flex={1}>
          <Text variant="xs" numberOfLines={1}>
            {title}
          </Text>

          {stopsCount !== undefined && (
            <Text variant="xs" color="mono60">
              {`${stopsCount} ${pluralize("stop", stopsCount)}`}
            </Text>
          )}
        </Flex>

        {selected ? (
          <CheckmarkStrokeIcon
            testID="add-to-itinerary-row-selected"
            width={TICK_SIZE}
            height={TICK_SIZE}
          />
        ) : (
          <EmptyCheckCircleIcon
            testID="add-to-itinerary-row-unselected"
            width={TICK_SIZE}
            height={TICK_SIZE}
          />
        )}
      </Flex>
    </TouchableOpacity>
  )
}
