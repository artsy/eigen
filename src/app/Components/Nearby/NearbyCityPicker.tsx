import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { TouchableRow } from "app/Components/TouchableRow"
import { GlobalStore } from "app/store/GlobalStore"
import { Button, Input } from "palette"
import { useState } from "react"
import { FlatList } from "react-native"
import rawCities from "./cities.json"

export interface City {
  name: string
  full_name: string
  slug: string
}

export const NearbyCityPicker: React.FC = () => {
  const [filteredCities, setFilteredCities] = useState<City[]>([])

  const selectedCity = GlobalStore.useAppState((state) => state.userPrefs.city)

  const cities = rawCities as City[]
  const onSelect = (city: City) => {
    GlobalStore.actions.userPrefs.setCity(city)
  }

  return !!selectedCity ? (
    <Flex flex={1} alignItems="center" justifyContent="center">
      <Text>{selectedCity.full_name}</Text>
      <Spacer y={2} />
      <Button onPress={() => GlobalStore.actions.userPrefs.setCity(undefined)}>Change</Button>
    </Flex>
  ) : (
    <Flex m={2}>
      <Spacer y={4} />
      <Text>Select a city to see nearby shows and fairs</Text>
      <Spacer y={2} />
      <Input
        onChangeText={(text) => {
          if (text.length > 2) {
            const matchingCities = cities.filter((city) =>
              city.name.toLowerCase().includes(text.toLowerCase())
            )
            setFilteredCities(matchingCities)
            console.log(matchingCities)
          } else {
            setFilteredCities([])
          }
        }}
      />
      <Spacer y={2} />
      <FlatList
        data={filteredCities}
        renderItem={({ item }) => {
          return (
            <Flex mb={2}>
              <TouchableRow onPress={() => onSelect(item)}>
                <Text>{item.full_name}</Text>
              </TouchableRow>
            </Flex>
          )
        }}
      />
    </Flex>
  )
}
