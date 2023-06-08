import { Avatar, Spacer, Flex, Text } from "@artsy/palette-mobile"
import { CustomArtist } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { take } from "lodash"

export const ArtistCustomArtist: React.FC<{
  artist: CustomArtist
}> = ({ artist }) => {
  const Initials = (string = "", length = 3) => {
    if (!string) return null

    // FIXME: Expected 1 arguments, but got 2.
    // @ts-ignore
    const letters = take(string.match(/\b[A-Z]/g, ""), length)
    if (letters.length >= 1) return letters.join("").toUpperCase()

    // FIXME: Expected 1 arguments, but got 2.
    // @ts-ignore
    return take(string.match(/\b\w/g, ""), length).join("").toUpperCase()
  }

  return (
    <Flex flexDirection="row" alignItems="center">
      <Avatar initials={Initials(artist.name) || ""} size="xs" />
      <Spacer x={1} />
      <Flex flex={1} flexDirection="column" justifyContent="center">
        <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
          {artist.name}
        </Text>
        {(!!artist.nationality || !!artist.birthYear) && (
          <Text variant="xs" numberOfLines={1} color="black60" ellipsizeMode="tail">
            {!!artist.nationality && artist.nationality + ","}{" "}
            {!!artist.birthYear && "b. " + artist.birthYear}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
