import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { getLocationPredictions, SimpleLocation } from "lib/utils/googleMaps"
import { Box, Flex, Input, LocationIcon, Separator, Text, Touchable, useSpace } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { FlatList } from "react-native"

// TODO
interface Props {
  onChange: any
  initialLocation: SimpleLocation | null
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange, initialLocation }) => {
  const [predictions, setPredictions] = useState<SimpleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [query, setQuery] = useState(selectedLocation?.name || "")

  useEffect(() => {
    setPredictions([])
    onChange(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    if (query !== selectedLocation?.name) {
      setSelectedLocation(null)
    }

    if (query.length < 3 || selectedLocation?.name === query) {
      setPredictions([])
    } else {
      ;(async () => {
        const googlePredictions = await getLocationPredictions(query)
        setPredictions(googlePredictions)
      })()
    }
  }, [query])

  const reset = () => {
    if (selectedLocation) {
      setQuery(selectedLocation.name)
    }
  }
  const touchOut = () => {
    if (!!predictions.length) {
      setPredictions([])
    }
  }

  return (
    <Box>
      <Input
        title="Location"
        placeholder="Enter City Where Artwork Is Located"
        onChangeText={setQuery}
        onFocus={reset}
        value={selectedLocation ? selectedLocation.name : query}
      />
      <Box height={198}>
        <LocationPredictions
          predictions={predictions}
          query={query}
          onSelect={setSelectedLocation}
          onOutsidePress={touchOut}
        />
      </Box>
    </Box>
  )
}

export const LocationPredictions = ({
  predictions,
  query,
  onSelect,
}: {
  predictions: SimpleLocation[]
  query?: string
  onSelect: (l: SimpleLocation) => void
  onOutsidePress: () => void
}) => {
  const space = useSpace()
  const flatListRef = useRef<FlatList<any>>(null)

  const highlightedQuery = (entry: string) => {
    const re = new RegExp(`(${query?.replace(" ", "|")})`, "gi")
    const brokenEntry = entry.split(re)
    if (!query || brokenEntry.length === 1) {
      return entry
    }
    const formatted = brokenEntry.map((x, i) => {
      if (re.test(x)) {
        return (
          <Text key={`map-entry-${i}`} fontWeight="bold">
            {x}
          </Text>
        )
      }
      return x
    })
    return formatted
  }

  if (predictions.length === 0) {
    return null
  }

  return (
    <AboveTheFoldFlatList<any>
      listRef={flatListRef}
      style={{
        flex: 1,
        padding: space(2),
        borderStyle: "solid",
        borderColor: "#707070",
        borderWidth: 1,
        marginTop: 3,
      }}
      data={predictions}
      showsVerticalScrollIndicator
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        !predictions.length
          ? () => {
              return (
                <>
                  <Text variant="md" color="black60" textAlign="center">
                    Please try searching again with a different spelling.
                  </Text>
                </>
              )
            }
          : null
      }
      renderItem={({ item, index }) => {
        return (
          <Flex key={index} mb={1}>
            <Touchable
              onPress={() => {
                onSelect(item)
              }}
            >
              <Flex flexDirection="row" alignItems="center">
                <LocationIcon mr={1} />
                <Text variant="xs">{highlightedQuery(item.name)}</Text>
              </Flex>
            </Touchable>
            <Separator mt={1} />
          </Flex>
        )
      }}
    />
  )
}
