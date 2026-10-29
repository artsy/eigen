import { Flex, Separator, Text, Touchable, useColor, useSpace } from "@artsy/palette-mobile"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import {
  LocationWithDetails,
  SimpleLocation,
  getLocationDetails,
  getLocationPredictions,
} from "app/utils/googleMaps"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useEffect, useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MIN_QUERY_LENGTH = 3
const SNAP_POINTS = ["85%"]

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
  const [predictions, setPredictions] = useState<SimpleLocation[] | null>(null)
  const { debouncedValue: debouncedQuery } = useDebouncedValue({ value: query, delay: 300 })

  useEffect(() => {
    if (visible) {
      setQuery(initialQuery)
      setPredictions(null)
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
    KeyboardController.dismiss()
    onDismiss()
  }

  const selectPrediction = async (prediction: SimpleLocation) => {
    onSelect(await getLocationDetails(prediction))
    close()
  }

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
          value={query}
          onChangeText={setQuery}
        />
      </Flex>

      <BottomSheetFlatList
        data={predictions ?? []}
        keyExtractor={(prediction: SimpleLocation) => prediction.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottom + space(2) }}
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
