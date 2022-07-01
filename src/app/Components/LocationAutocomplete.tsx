import themeGet from "@styled-system/theme-get"
import {
  getLocationDetails,
  getLocationPredictions,
  LocationWithDetails,
  SimpleLocation,
} from "app/utils/googleMaps"
import { Flex, Input, LocationIcon, Text, Touchable } from "palette"
import React, { useEffect, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import styled from "styled-components/native"

interface LocationAutocompleteInputProps {
  title: string
  placeholder?: string
  detailed?: boolean
  floating?: boolean
  initialLocation: SimpleLocation | null
  onChange: (l: SimpleLocation | LocationWithDetails | null) => void
}

export const LocationAutocompleteInput: React.FC<LocationAutocompleteInputProps> = ({
  title,
  placeholder,
  initialLocation,
  onChange,
  detailed,
  floating,
}) => {
  const [predictions, setPredictions] = useState<SimpleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [query, setQuery] = useState(selectedLocation?.name || "")

  useEffect(() => {
    setPredictions([])
    handleChange(selectedLocation)
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

  const handleChange = async (selection: SimpleLocation | null) => {
    if (!selection) {
      return
    }

    if (detailed) {
      const locationDetails = await getLocationDetails(selection)

      onChange(locationDetails)
    }

    onChange(selection)
  }

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
    <>
      <Input
        testID="autocomplete-location-input"
        title={title}
        placeholder={placeholder}
        onChangeText={setQuery}
        onFocus={reset}
        value={selectedLocation ? selectedLocation.name : query}
      />

      <LocationPredictions
        predictions={predictions}
        query={query}
        onSelect={setSelectedLocation}
        onOutsidePress={touchOut}
        isFloating={floating}
      />
    </>
  )
}

const LocationPredictions = ({
  predictions,
  query,
  onSelect,
  onOutsidePress,
  isFloating,
}: // strict,
{
  predictions: SimpleLocation[]
  query?: string
  onSelect: (l: SimpleLocation) => void
  onOutsidePress?: () => void
  isFloating?: boolean
  strict?: boolean
}) => {
  const [height, setHeight] = useState(0)

  const { height: screenHeight } = useScreenDimensions()

  // const { onOutsidePress, query, isFloating, predictions, onSelect, strict } = props

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
    <>
      <TouchableWithoutFeedback onPress={onOutsidePress}>
        <Backdrop style={{ height }} onLayout={() => setHeight(screenHeight)} />
      </TouchableWithoutFeedback>

      <Dropdown
        style={{ position: isFloating ? "absolute" : undefined, top: isFloating ? 70 : undefined }}
      >
        {predictions.map((p) => (
          <Touchable haptic key={p.id} onPress={() => onSelect(p)} style={{ padding: 10 }}>
            <Flex flexDirection="row" alignItems="center">
              <LocationIcon mr={1} />
              <Text style={{ flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>
                {highlightedQuery(p.name)}
              </Text>
            </Flex>
          </Touchable>
        ))}
      </Dropdown>
    </>
  )
}

const Dropdown = styled(Flex)`
  background-color: ${themeGet("colors.white100")};
  border: solid 1px ${themeGet("colors.black10")};
  z-index: 1;
  width: 100%;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

const Backdrop = styled(Flex)`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`
