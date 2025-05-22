import { ActionType, DeletedSavedSearch, OwnerType } from "@artsy/cohesion"
import {
  Box,
  ChevronIcon,
  Flex,
  Image,
  NoImageIcon,
  Text,
  Touchable,
  TrashIcon,
  useColor,
} from "@artsy/palette-mobile"
import {
  SavedSearchListItem_alert$data,
  SavedSearchListItem_alert$key,
} from "__generated__/SavedSearchListItem_alert.graphql"
import { deleteSavedSearchMutation } from "app/Scenes/SavedSearchAlert/mutations/deleteSavedSearchAlert"
import { Alert } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface SavedSearchListItemProps {
  isSwipingActive?: boolean
  displayImage?: boolean
  onPress: (alert: SavedSearchListItem_alert$data) => void
  onSwipeBegin: (id: string) => void
  onDelete?: (id: string) => void
  alert: SavedSearchListItem_alert$key
}

const FALLBACK_TITLE = "Untitled Alert"
const DELETE_BUTTON_WIDTH = 91

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { isSwipingActive, displayImage, onPress, onSwipeBegin, onDelete } = props

  const alert = useFragment(alertFragment, props.alert)

  const image = alert?.artworksConnection?.edges?.[0]?.node?.image

  const color = useColor()
  const tracking = useTracking()

  const isDeleteButtonVisible = useSharedValue(false)
  const translateX = useSharedValue(0)

  // Reset the swipe when user swipes another item
  if (!isSwipingActive) {
    translateX.set(() => withTiming(0, { duration: 500, easing: Easing.out(Easing.circle) }))
    isDeleteButtonVisible.set(() => false)
  }

  const handlePress = () => {
    onPress?.(alert)
  }

  const pan = Gesture.Pan()
    .failOffsetY([-5, 5])
    .activeOffsetX([-5, 5])
    .withTestId(`pan-alert-${alert.internalID}`)
    .onBegin(() => {
      runOnJS(onSwipeBegin)(alert.internalID)
    })
    .onChange((event) => {
      // Prevent swiping to the right
      if (translateX.get() >= 0 && event.translationX > 0) {
        return
      }

      // Prevent over-swiping to the left
      if (translateX.get() <= -DELETE_BUTTON_WIDTH && event.translationX < 0) {
        return
      }

      translateX.value = isDeleteButtonVisible.get()
        ? event.translationX - DELETE_BUTTON_WIDTH
        : event.translationX

      if (isDeleteButtonVisible.get()) {
        translateX.set(() => event.translationX - DELETE_BUTTON_WIDTH)
      } else {
        translateX.set(() => event.translationX)
      }
    })
    .onEnd(() => {
      // If the user swipes more than half of the delete button width, show the delete button fully
      if (translateX.get() < -DELETE_BUTTON_WIDTH / 2) {
        translateX.set(() =>
          withTiming(-DELETE_BUTTON_WIDTH, {
            duration: 500,
            easing: Easing.out(Easing.circle),
          })
        )
        isDeleteButtonVisible.set(() => true)
      } else {
        // Otherwise, hide the delete button
        translateX.set(() => withTiming(0, { duration: 500, easing: Easing.out(Easing.circle) }))
        isDeleteButtonVisible.set(() => false)
      }
    })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.get() }],
    }
  })

  const onDeletePress = async () => {
    try {
      await deleteSavedSearchMutation(alert.internalID)
      tracking.trackEvent(tracks.deletedSavedSearch(alert.internalID))
      onDelete?.(alert.internalID)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteAlert = () => {
    Alert.alert(
      "Delete Alert",
      "You will no longer receive notifications for artworks matching the criteria in this alert.",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeletePress()
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
      ]
    )
  }

  return (
    <Flex>
      <GestureDetector gesture={pan}>
        <Animated.View>
          <Flex
            position="absolute"
            top={0}
            bottom={0}
            right={0}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            backgroundColor="red100"
            width={DELETE_BUTTON_WIDTH}
          >
            <Touchable
              onPress={() => handleDeleteAlert()}
              testID={`delete-button-${alert.internalID}`}
            >
              <Flex flexDirection="row" alignItems="center" width="100%" height="100%">
                <Text variant="sm-display" color="mono0" selectable={false}>
                  Delete
                </Text>
                <TrashIcon fill="mono0" width="16px" height="16px" />
              </Flex>
            </Touchable>
          </Flex>

          <Animated.View style={animatedStyles}>
            <Touchable
              onPress={handlePress}
              underlayColor={color("mono5")}
              activeOpacity={1}
              haptic
              onLongPress={handlePress}
            >
              <Box px={2} py={1} backgroundColor="mono0">
                <Flex flexDirection="row" alignItems="center" justifyContent="flex-start">
                  {!!displayImage && (
                    <Flex mr={1}>
                      <Flex
                        testID="Fallback"
                        backgroundColor="mono5"
                        width={60}
                        height={60}
                        justifyContent="center"
                      >
                        {!!image?.resized?.url ? (
                          <Image
                            resizeMode="contain"
                            src={image?.resized?.url}
                            height={60}
                            width={60}
                            blurhash={image.blurhash}
                            performResize={false}
                          />
                        ) : (
                          <NoImageIcon fill="mono60" mx="auto" />
                        )}
                      </Flex>
                    </Flex>
                  )}

                  <Flex flex={1} flexDirection="column">
                    <Text variant="sm" selectable={false}>
                      {alert.title ?? FALLBACK_TITLE}
                    </Text>
                    {!!alert.subtitle && (
                      <Text variant="sm" color="mono60" selectable={false}>
                        {alert.subtitle}
                      </Text>
                    )}
                  </Flex>
                  <ChevronIcon direction="right" fill="mono60" />
                </Flex>
              </Box>
            </Touchable>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Flex>
  )
}

const alertFragment = graphql`
  fragment SavedSearchListItem_alert on Alert {
    internalID
    artistSeriesIDs
    title: displayName(only: [artistIDs])
    subtitle: displayName(except: [artistIDs])
    artworksConnection(first: 1) {
      counts {
        total
      }
      edges {
        node {
          image {
            resized(version: "square", width: 120, height: 120) {
              url
              height
              width
            }
            blurhash
          }
        }
      }
    }
  }
`

export const tracks = {
  deletedSavedSearch: (id: string): DeletedSavedSearch => ({
    action: ActionType.deletedSavedSearch,
    context_screen_owner_type: OwnerType.savedSearch,
    context_screen_owner_id: id,
  }),
}
