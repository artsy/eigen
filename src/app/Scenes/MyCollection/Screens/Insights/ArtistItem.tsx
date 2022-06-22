import { ArtistItem_artist$key } from "__generated__/ArtistItem_artist.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Flex, NoArtworkIcon, Text, Touchable, useColor } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { AverageSalePriceArtistType } from "./AverageSalePriceSelectArtistModal"

interface ArtistItemProps {
  artist: ArtistItem_artist$key
  onPress: (artist: AverageSalePriceArtistType) => void
  isFirst?: boolean
}

export const ArtistItem: React.FC<ArtistItemProps> = ({ isFirst, onPress, ...restProps }) => {
  const color = useColor()
  const artist = useFragment(CollectedArtistsFragment, restProps.artist)

  return (
    <Touchable
      testID={`artist-section-item-${artist.name}`}
      underlayColor={color("black5")}
      onPress={() => onPress(artist)}
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
          backgroundColor="black10"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          style={{ marginTop: 3 }}
        >
          {!artist.imageUrl ? (
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          ) : (
            <OpaqueImageView width={40} height={40} imageURL={artist.imageUrl} />
          )}
        </Flex>
        {/* Sale Artwork Artist Name, Nationality and Birthday */}
        <Flex flex={1} pl={1}>
          {!!artist.name && (
            <Text variant="md" ellipsizeMode="middle" numberOfLines={2}>
              {artist.name}
            </Text>
          )}
          {!!artist.formattedNationalityAndBirthday && (
            <Flex>
              <Text variant="xs" ellipsizeMode="middle" color="black60">
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
    name
    initials
    formattedNationalityAndBirthday
    imageUrl
  }
`
