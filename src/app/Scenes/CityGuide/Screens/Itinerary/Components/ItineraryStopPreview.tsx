import { CloseIcon } from "@artsy/icons/native"
import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage, TouchableOpacity } from "react-native"

const IMAGE_HEIGHT = 220
const CLOSE_SIZE = 40

interface Props {
  stop: ItineraryStop | null
  onClose: () => void
  /** Switches the screen to the map with this stop selected. */
  onShowOnMap: (stopId: string) => void
}

/**
 * The sheet shown when a stop in the list is tapped. Everything here is the guide
 * author's own copy — title, address, hours and note — rather than the entity's, so it
 * needs no query. Only the save control resolves the real entity.
 */
export const ItineraryStopPreview: React.FC<Props> = ({ stop, onClose, onShowOnMap }) => {
  return (
    // handleComponent={null} drops the drag indicator: the image runs to the top edge
    // and the close button is the affordance instead.
    <AutoHeightBottomSheet visible={!!stop} onDismiss={onClose} handleComponent={null}>
      {!!stop && (
        <Flex>
          <Flex>
            <RNImage
              src={stop.imageUrl}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              style={{ width: "100%", height: IMAGE_HEIGHT }}
            />

            <TouchableOpacity
              testID="itinerary-stop-preview-close"
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

            <Text variant="sm" mt={1}>
              {stop.displayTime}
            </Text>

            {!!stop.note && (
              <Text variant="sm" mt={1}>
                {stop.note}
              </Text>
            )}

            <Spacer y={2} />

            <Flex flexDirection="row" gap={1}>
              {/*
                The outline button is a labelled stand-in for the row's plus control, so
                the real follow lives in one place rather than being reimplemented here.
              */}
              {!!stop.saveTarget && (
                <Flex flex={1}>
                  <ItineraryStopSaveControl
                    saveTarget={stop.saveTarget}
                    stopTitle={stop.title}
                    variant="button"
                  />
                </Flex>
              )}

              <Flex flex={1}>
                <Button
                  testID="itinerary-stop-preview-show-on-map"
                  block
                  onPress={() => onShowOnMap(stop.id)}
                >
                  Show on map
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </AutoHeightBottomSheet>
  )
}
