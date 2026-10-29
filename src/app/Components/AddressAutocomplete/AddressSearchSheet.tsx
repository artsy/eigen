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
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MIN_QUERY_LENGTH = 3
const SNAP_POINTS = ["85%"]

interface AddressSearchSheetProps {
  visible: boolean
  title: string
  country?: string
  onDismiss: () => void
  onSelect: (address: LocationWithDetails) => void
}

export const AddressSearchSheet: React.FC<AddressSearchSheetProps> = ({
  visible,
  title,
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
      setQuery("")
      setPredictions(null)
    }
  }, [visible])

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

  const selectPrediction = async (prediction: SimpleLocation) => {
    onSelect(await getLocationDetails(prediction))
    onDismiss()
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
      onDismiss={onDismiss}
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
