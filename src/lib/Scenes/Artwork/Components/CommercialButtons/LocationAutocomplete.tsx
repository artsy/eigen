import { Input } from "lib/Components/Input/Input"
import { GMapsLocation, queryLocation } from "lib/utils/googleMaps"
import { color, Flex, LocationIcon, Text, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components/native"

interface Props {
  onChange: any
}

export const LocationAutocomplete: React.FC<Props> = ({ onChange }) => {
  const [predictions, setPredictions] = useState<GMapsLocation[]>([])
  const [query, setQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  // Autofocus
  const input = useRef<Input>(null)
  useEffect(() => {
    input.current?.focus()
  }, [input])

  useEffect(() => {
    setPredictions([])
    onChange(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    if (query.length < 3) {
      setPredictions([])
    } else {
      ;(async function getPredictions() {
        const googlePredictions = await queryLocation(query)
        setPredictions(googlePredictions)
      })()
    }
  }, [query])

  const reset = () => {
    setQuery(selectedLocation)
    setSelectedLocation("")
  }

  return (
    <>
      <Text>Location</Text>
      <Input
        ref={input}
        placeholder="Add Location"
        style={{ marginVertical: 10 }}
        onChangeText={setQuery}
        onFocus={reset}
        value={selectedLocation || query}
      />
      <LocationPredictions predictions={predictions} query={query} onSelect={setSelectedLocation} />
      <Text color="black60">
        Sharing your location with galleries helps them provide fast and accurate shipping quotes. You can always edit
        this information later in your Collector Profile.
      </Text>
    </>
  )
}

const LocationPredictions = ({
  predictions,
  query,
  onSelect,
}: {
  predictions: GMapsLocation[]
  query?: string
  onSelect: (l: string) => void
}) => {
  const highlightedQuery = (entry: string) => {
    const re = new RegExp(`(${query?.replace(" ", "|")})`, "gi")
    const brokenEntry = entry.split(re)
    if (!query || brokenEntry.length === 1) {
      return entry
    }
    const formatted = brokenEntry.map((x) => {
      if (re.test(x)) {
        return <Text fontWeight="bold">{x}</Text>
      }
      return x
    })
    return formatted
  }

  if (predictions.length === 0) {
    return null
  }

  return (
    <Dropdown data-test-id="dropdown">
      {predictions.map((p) => (
        <Touchable
          key={p.id}
          onPress={() => {
            onSelect(p.name)
          }}
          style={{ padding: 10 }}
        >
          <Flex flexDirection="row">
            <LocationIcon mr={1} />
            <Text>{highlightedQuery(p.name)}</Text>
          </Flex>
        </Touchable>
      ))}
    </Dropdown>
  )
}

const Dropdown = styled(Flex)`
  background-color: white;
  border: solid 1px ${color("black10")};
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 70;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`
