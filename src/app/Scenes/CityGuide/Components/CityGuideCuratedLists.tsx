import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 80

const ListItem = ({ item }: { item: (typeof data)[0] }) => {
  return (
    <Flex flexDirection="row" gap={1}>
      <RNImage src={item.image} width={IMAGE_SIZE} height={IMAGE_SIZE} resizeMode="cover" />

      <Flex flex={1}>
        <Text variant="lg-display">{item.title}</Text>
        <Text variant="xs" color="mono60">
          By {item.author}
        </Text>
      </Flex>
    </Flex>
  )
}
export const CityGuideCuratedLists = () => {
  return (
    <Flex px={2}>
      <Join separator={<Spacer y={2} />}>
        {data.map((item) => (
          <ListItem key={item.id} item={item} />
        ))}
      </Join>
    </Flex>
  )
}

const data = [
  {
    id: 1,
    image: "https://picsum.photos/200/300.jpg",
    title: "36 Hours in London",
    author: "Casey Lesser",
  },
  {
    id: 2,
    image: "https://picsum.photos/200/300.jpg",
    title: "Must Sees & Hidden Gems ",
    author: "Casey Lesser",
  },
  {
    id: 3,
    image: "https://picsum.photos/200/300.jpg",
    title: "Chill Vibes Only ",
    author: "Casey Lesser",
  },
]
