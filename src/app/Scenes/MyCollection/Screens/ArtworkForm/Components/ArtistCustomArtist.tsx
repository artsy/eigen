import { Avatar, Spacer, Flex, Text } from "@artsy/palette-mobile"
import { MyCollectionCustomArtistSchema } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { Initials } from "app/Scenes/MyCollection/utils/convertNameToInitials"

export const ArtistCustomArtist: React.FC<{
  artist: MyCollectionCustomArtistSchema
}> = ({ artist }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Avatar initials={Initials(artist.name) || ""} size="xs" />
      <Spacer x={1} />
      <Flex flex={1} flexDirection="column" justifyContent="center">
        <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
          {artist.name}
        </Text>
        {(!!artist.nationality || !!artist.birthYear) && (
          <Text variant="xs" numberOfLines={1} color="mono60" ellipsizeMode="tail">
            {!!artist.nationality && artist.nationality + ","}{" "}
            {!!artist.birthYear && "b. " + artist.birthYear}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
