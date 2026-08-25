import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { pluralize } from "app/utils/pluralize"
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 44

const EventItem = ({ count, title }: { count: number; title: string }) => {
  return (
    <Flex flexDirection="row" gap={1} alignItems="center">
      <RNImage
        src="https://picsum.photos/200/300.jpg"
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        resizeMode="cover"
      />
      <Flex flex={1}>
        <Text variant="sm-display">
          {count} {pluralize(title, count)}
        </Text>
        <Text variant="xs" color="mono60">
          Date Placeholder
        </Text>
      </Flex>
    </Flex>
  )
}

export const CityGuideFairs = () => {
  return (
    <Flex px={2}>
      <SectionTitle title="Current Fairs" onPress={() => {}} />

      <EventItem count={fairsData.length} title="Fair" />
    </Flex>
  )
}

export const CityGuideShows = () => {
  return (
    <Flex px={2}>
      <SectionTitle title="Current Shows" onPress={() => {}} />

      <EventItem count={showsData.length} title="Show" />
    </Flex>
  )
}

export const CityGuideEvents = () => {
  return (
    <Join separator={<Spacer y={2} />}>
      <CityGuideFairs />
      <CityGuideShows />
    </Join>
  )
}

const fairsData = [
  {
    id: 1,
    name: "Art Basel",
    location: "Miami, FL",
    image: "https://picsum.photos/200/300.jpg",
  },
]

const showsData = [
  {
    id: 1,
    name: "The Metropolitan Museum of Art",
    image: "https://picsum.photos/200/300.jpg",
  },
  {
    id: 2,
    name: "The Guggenheim Museum",
    image: "https://picsum.photos/200/300.jpg",
  },
  {
    id: 3,
    name: "The Museum of Modern Art",
    image: "https://picsum.photos/200/300.jpg",
  },
]
