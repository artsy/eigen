import { NoArtworkIcon, Flex, useColor, Text, Touchable, Image } from "@artsy/palette-mobile"
import { ArtistItem_artist$key } from "__generated__/ArtistItem_artist.graphql"
import { graphql, useFragment } from "react-relay"

interface ArtistItemProps {
  artist: ArtistItem_artist$key
  onPress: (artistID: string) => void
  isFirst?: boolean
}

export const ArtistItem: React.FC<ArtistItemProps> = ({ isFirst, onPress, ...restProps }) => {
  const color = useColor()
  const artist = useFragment(CollectedArtistsFragment, restProps.artist)

  return (
    <Touchable
      accessibilityRole="button"
      testID={`artist-section-item-${artist.name}`}
      underlayColor={color("mono5")}
      onPress={() => onPress(artist.internalID)}
      haptic
    >
      <Flex
        pt={isFirst ? 0 : 1}
        pb={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor="mono10"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          style={{ marginTop: 3 }}
        >
          {!artist.imageUrl ? (
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          ) : (
            <Image width={40} height={40} src={artist.imageUrl} />
          )}
        </Flex>
        {/* Sale Artwork Artist Name, Nationality and Birthday */}
        <Flex flex={1} pl={1}>
          {!!artist.name && (
            <Text variant="sm-display" ellipsizeMode="middle" numberOfLines={2}>
              {artist.name}
            </Text>
          )}
          {!!artist.formattedNationalityAndBirthday && (
            <Flex>
              <Text variant="xs" ellipsizeMode="middle" color="mono60">
                {artist?.formattedNationalityAndBirthday}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

const CollectedArtistsFragment = graphql`
  fragment ArtistItem_artist on Artist {
    internalID
    name
    initials
    formattedNationalityAndBirthday
    imageUrl
  }
`
