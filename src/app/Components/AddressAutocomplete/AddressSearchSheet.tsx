import { MapPinIcon } from "@artsy/icons/native"
import {
  Flex,
  Separator,
  Spinner,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { captureException } from "@sentry/react-native"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { ACCESSIBLE_SMALL_ICON_SIZE } from "app/Components/constants"
import { getCurrentLocation } from "app/utils/getCurrentLocation"
import {
  LocationWithDetails,
  SimpleLocation,
  getAddressFromCoordinates,
  getLocationDetails,
  getLocationPredictions,
} from "app/utils/googleMaps"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useEffect, useRef, useState } from "react"
import { AccessibilityInfo, Platform } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MIN_QUERY_LENGTH = 3
const SNAP_POINTS = ["85%"]
const CURRENT_LOCATION_ERROR = "We couldn’t find an address for your current location."
const PRECISE_LOCATION_ERROR = "Turn on precise location to use your current address."

interface AddressSearchSheetProps {
  visible: boolean
  title: string
  /** Fills the search box when the sheet opens, eg with the address picked before */
  initialQuery?: string
  country?: string
  onDismiss: () => void
  onSelect: (address: LocationWithDetails) => void
}

export const AddressSearchSheet: React.FC<AddressSearchSheetProps> = ({
  visible,
  title,
  initialQuery = "",
  country,
  onDismiss,
  onSelect,
}) => {
  const color = useColor()
  const space = useSpace()
  const { bottom } = useSafeAreaInsets()
  const [query, setQuery] = useState("")
  // What Use Current Location found, which refills the search box
  const [locatedAddress, setLocatedAddress] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<SimpleLocation[] | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  // Raised by each lookup, keystroke and close, so a slow lookup can't land somewhere stale
  const lookupRef = useRef(0)
  const { debouncedValue: debouncedQuery } = useDebouncedValue({ value: query, delay: 300 })

  useEffect(() => {
    if (visible) {
      setQuery(initialQuery)
      // The sheet outlives its content, so drop the last open's location fill
      setLocatedAddress(null)
      setPredictions(null)
      setLocationError(null)
    }
  }, [visible, initialQuery])

  useEffect(() => {
    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setPredictions(null)
      return
    }

    let cancelled = false
    getLocationPredictions(debouncedQuery, { types: "address", country }).then((results) => {
      if (!cancelled) {
        setPredictions(results ?? [])
      }
    })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, country])

  // Android keeps the keyboard open after the sheet's input goes away
  const close = () => {
    // A lookup still running would otherwise fill the next open
    lookupRef.current += 1
    KeyboardController.dismiss()
    onDismiss()
  }

  const selectPrediction = async (prediction: SimpleLocation) => {
    onSelect(await getLocationDetails(prediction))
    close()
  }

  const showLocationError = (message: string) => {
    setLocationError(message)
    // Android reads the error through its live region
    if (Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(message)
    }
  }

  const handleChangeText = (text: string) => {
    lookupRef.current += 1
    setQuery(text)
  }

  // The location only fills the search, so the user still picks the address from the results
  const searchCurrentLocation = async () => {
    const lookup = ++lookupRef.current
    const isStale = () => lookup !== lookupRef.current

    setLocating(true)
    setLocationError(null)

    try {
      const current = await getCurrentLocation()
      const address =
        current.status === "located" ? await getAddressFromCoordinates(current.location) : null

      if (isStale()) {
        return
      }

      if (current.status === "approximate") {
        showLocationError(PRECISE_LOCATION_ERROR)
      } else if (!address) {
        showLocationError(CURRENT_LOCATION_ERROR)
      } else if (country && address.countryCode?.toLowerCase() !== country.toLowerCase()) {
        const code = country.toUpperCase()
        showLocationError(
          `It looks like you’re not in the ${code}. We only accept ${code} addresses for now.`
        )
      } else {
        setQuery(address.name)
        setLocatedAddress(address.name)
      }
    } catch (error) {
      captureException(error)
      if (!isStale()) {
        showLocationError(CURRENT_LOCATION_ERROR)
      }
    } finally {
      setLocating(false)
    }
  }

  // Stays until results replace it, so the list doesn't jump at the third character
  const showCurrentLocation = !predictions

  return (
    <AutomountedBottomSheetModal
      sentryName="AddressSearchSheet"
      visible={visible}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: color("mono0") }}
      onDismiss={close}
    >
      <Flex px={2} pt={1} pb={1} gap={2}>
        <Text variant="sm-display">{title}</Text>
        <BottomSheetInput
          autoFocus
          placeholder="Start typing an address"
          accessibilityLabel="Search addresses"
          autoComplete="street-address"
          textContentType="fullStreetAddress"
          // Uncontrolled, since a controlled input lags while typing. The sheet remounts on open,
          // and the key remounts the input when the location fills it
          key={locatedAddress ?? "typed"}
          defaultValue={locatedAddress ?? initialQuery}
          onChangeText={handleChangeText}
        />
      </Flex>

      <BottomSheetFlatList
        data={predictions ?? []}
        keyExtractor={(prediction: SimpleLocation) => prediction.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottom + space(2) }}
        ListHeaderComponent={
          showCurrentLocation ? (
            <Touchable
              accessibilityRole="button"
              disabled={locating}
              onPress={searchCurrentLocation}
            >
              <Flex px={2} pb={2} gap={0.5}>
                <Flex flexDirection="row" alignItems="center" gap={1}>
                  <Flex width={ACCESSIBLE_SMALL_ICON_SIZE}>
                    {locating ? (
                      <Spinner size="small" />
                    ) : (
                      <Flex
                        width={ACCESSIBLE_SMALL_ICON_SIZE}
                        height={ACCESSIBLE_SMALL_ICON_SIZE}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <MapPinIcon size={ACCESSIBLE_SMALL_ICON_SIZE} />
                      </Flex>
                    )}
                  </Flex>
                  <Text variant="sm" mt={0.5}>
                    Use Current Location
                  </Text>
                </Flex>
                {!!locationError && (
                  <Text variant="xs" color="red100" accessibilityLiveRegion="polite">
                    {locationError}
                  </Text>
                )}
              </Flex>
            </Touchable>
          ) : null
        }
        ListEmptyComponent={
          predictions ? (
            <Text variant="sm" color="mono60" px={2} pt={1}>
              No matching addresses.
            </Text>
          ) : null
        }
        renderItem={({ item }: { item: SimpleLocation }) => (
          <Touchable accessibilityRole="button" onPress={() => selectPrediction(item)}>
            <Flex px={2} py={2}>
              <Text variant="sm">{item.name}</Text>
            </Flex>
          </Touchable>
        )}
        ItemSeparatorComponent={() => <Separator mx={2} />}
      />
    </AutomountedBottomSheetModal>
  )
}
