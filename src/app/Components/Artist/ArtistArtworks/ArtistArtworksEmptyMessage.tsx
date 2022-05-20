import { Flex, Text } from "palette"

export const ArtistArtworksEmptyMessage = () => {
  return (
    <Flex p={2} bg="black5">
      <Text variant="sm" color="black100">
        No works available by the artist at this time
      </Text>
      <Text variant="sm" mt={0.5} color="black60">
        Create an Alert to receive notifications when new works are added
      </Text>
    </Flex>
  )
}
