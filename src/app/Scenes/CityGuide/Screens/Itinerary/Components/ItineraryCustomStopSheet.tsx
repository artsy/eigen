import { CloseIcon, NoArtIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage, TouchableOpacity } from "react-native"

const IMAGE_HEIGHT = 220
const CLOSE_SIZE = 40
const NO_ICON_SIZE = 40

interface Props {
  stop: ItineraryStop | null
  onClose: () => void
}

/**
 * What a custom stop shows when tapped: a cafe, a landmark, anything the curator typed in
 * rather than picked from Artsy. Every entity-backed stop navigates to its own page instead,
 * so this only ever renders the stop's own fields.
 */
export const ItineraryCustomStopSheet: React.FC<Props> = ({ stop, onClose }) => {
  return (
    // handleComponent={null} drops the drag indicator: the image runs to the top edge
    // and the close button is the affordance instead.
    <AutoHeightBottomSheet visible={!!stop} onDismiss={onClose} handleComponent={null}>
      {!!stop && (
        <Flex>
          <Flex>
            {stop.imageUrl ? (
              <RNImage
                testID="custom-stop-image"
                src={stop.imageUrl}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                style={{ width: "100%", height: IMAGE_HEIGHT }}
              />
            ) : (
              <Flex
                testID="custom-stop-no-image"
                height={IMAGE_HEIGHT}
                backgroundColor="mono10"
                alignItems="center"
                justifyContent="center"
              >
                <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
              </Flex>
            )}

            <TouchableOpacity
              testID="custom-stop-close"
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: CLOSE_SIZE,
                height: CLOSE_SIZE,
                borderRadius: CLOSE_SIZE / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
              }}
            >
              <CloseIcon />
            </TouchableOpacity>
          </Flex>

          <Flex p={2} pb={4}>
            <Flex flexDirection="row" alignItems="flex-start" gap={1}>
              <Flex flex={1}>
                <Text variant="lg-display">{stop.title}</Text>
              </Flex>

              {!!stop.category && (
                <Flex backgroundColor="mono100" px={0.5} py={0.5}>
                  <Text variant="xxs" color="mono0">
                    {stop.category}
                  </Text>
                </Flex>
              )}
            </Flex>

            {!!stop.address && (
              <Text variant="sm" color="mono60" mt={0.5}>
                {stop.address}
              </Text>
            )}

            {!!stop.displayTime && (
              <Text variant="sm" mt={1}>
                {stop.displayTime}
              </Text>
            )}

            {!!stop.note && (
              <Text variant="sm" mt={1}>
                {stop.note}
              </Text>
            )}

            {/* Where the curator found it. Off Artsy, so it is offered rather than navigated to. */}
            {!!stop.sourceURL && (
              <Flex mt={2} alignItems="flex-start">
                <RouterLink testID="custom-stop-source" to={stop.sourceURL}>
                  <Text variant="sm" underline>
                    More information
                  </Text>
                </RouterLink>
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </AutoHeightBottomSheet>
  )
}
