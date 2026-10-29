import { CloseIcon } from "@artsy/icons/native"
import { Flex, Screen, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { SearchInput } from "app/Components/SearchInput"
import {
  LocationWithDetails,
  SimpleLocation,
  getLocationDetails,
  getLocationPredictions,
} from "app/utils/googleMaps"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useEffect, useState } from "react"
import { FlatList, Modal } from "react-native"

const MIN_QUERY_LENGTH = 3

interface SellAddressSearchModalProps {
  visible: boolean
  onDismiss: () => void
  onSelect: (address: LocationWithDetails) => void
}

/** Full screen, so the suggestions sit above the keyboard instead of under it */
export const SellAddressSearchModal: React.FC<SellAddressSearchModalProps> = ({
  visible,
  onDismiss,
  onSelect,
}) => {
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
    getLocationPredictions(debouncedQuery, { types: "address", country: "us" }).then((results) => {
      if (!cancelled) {
        setPredictions(results ?? [])
      }
    })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const selectPrediction = async (prediction: SimpleLocation) => {
    onSelect(await getLocationDetails(prediction))
    onDismiss()
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      statusBarTranslucent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <Screen>
        <Flex p={2} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="sm-display">Street address</Text>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onPress={onDismiss}
          >
            <CloseIcon fill="mono60" />
          </Touchable>
        </Flex>

        <Flex mx={2} mb={1}>
          <SearchInput
            autoFocus
            placeholder="Start typing an address"
            accessibilityLabel="Search addresses"
            autoComplete="street-address"
            textContentType="fullStreetAddress"
            value={query}
            onChangeText={setQuery}
          />
        </Flex>

        <Separator />

        <FlatList
          data={predictions ?? []}
          keyExtractor={(prediction) => prediction.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            predictions ? (
              <Text variant="sm" color="mono60" px={2} pt={2}>
                No matching US addresses.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Touchable accessibilityRole="button" onPress={() => selectPrediction(item)}>
              <Flex px={2} py={2}>
                <Text variant="sm">{item.name}</Text>
              </Flex>
            </Touchable>
          )}
          ItemSeparatorComponent={() => <Separator mx={2} />}
        />
      </Screen>
    </Modal>
  )
}
