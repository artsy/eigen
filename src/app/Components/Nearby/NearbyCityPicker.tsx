import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { TouchableRow } from "app/Components/TouchableRow"
import { Button, Input } from "palette"
import { useState } from "react"
import { FlatList } from "react-native"
import cities from "./cities.json"

export const NearbyCityPicker: React.FC = () => {
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const cityNames = cities.map((city) => city.name.toLowerCase())

  const onSelect = (city: string) => {
    setSelectedCity(city)
  }

  return !!selectedCity ? (
    <Flex flex={1} alignItems="center" justifyContent="center">
      <Text>{selectedCity}</Text>
      <Button onPress={() => setSelectedCity(null)}>Change</Button>
    </Flex>
  ) : (
    <Flex m={2}>
      <Spacer y={4} />
      <Text>Select a city to see nearby shows and fairs</Text>
      <Spacer y={2} />
      <Input
        onChangeText={(text) => {
          if (text.length > 2) {
            const matchingCities = cityNames.filter((city) => city.includes(text.toLowerCase()))
            setFilteredCities(matchingCities)
            console.log(matchingCities)
          } else {
            setFilteredCities([])
          }
        }}
      />
      <FlatList
        data={filteredCities}
        renderItem={({ item }) => {
          return (
            <TouchableRow onPress={() => onSelect(item)}>
              <Text>{item}</Text>
            </TouchableRow>
          )
        }}
      />
    </Flex>
  )
}
