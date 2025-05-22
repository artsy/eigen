import { Avatar, Button, CheckIcon, Flex, Text } from "@artsy/palette-mobile"
import { MyCollectionArtistsAutosuggestItem_artist$key } from "__generated__/MyCollectionArtistsAutosuggestItem_artist.graphql"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { MotiView } from "moti"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface MyCollectionArtistsAutosuggestItemProps {
  artist: MyCollectionArtistsAutosuggestItem_artist$key
}

export const MyCollectionArtistsAutosuggestItem: FC<MyCollectionArtistsAutosuggestItemProps> = ({
  artist: _artist,
}) => {
  const artist = useFragment(QUERY, _artist)

  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)
  const addOrRemoveArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addOrRemoveArtist
  )

  if (!artist) {
    return null
  }

  const selected = artistIds.includes(artist.internalID)
  const displayAvatar = !!artist.coverArtwork?.image?.url || !!artist.initials

  const handleOnPress = () => {
    addOrRemoveArtist(artist.internalID)
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 200 }}
    >
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center" gap={1} flexShrink={1}>
          {!!displayAvatar && (
            <Avatar
              initials={artist.initials}
              size="xs"
              src={artist.coverArtwork?.image?.url ?? ""}
            />
          )}

          <Flex flexWrap="wrap">
            <Text variant="sm-display">{artist.name}</Text>
            <Text variant="sm-display" color="mono60">
              {artist.formattedNationalityAndBirthday}
            </Text>
          </Flex>
        </Flex>

        <Button
          size="small"
          icon={selected ? <CheckIcon fill="mono0" /> : undefined}
          variant={selected ? "fillSuccess" : "outline"}
          onPress={handleOnPress}
        >
          {!!selected ? "Selected" : "Select"}
        </Button>
      </Flex>
    </MotiView>
  )
}

const QUERY = graphql`
  fragment MyCollectionArtistsAutosuggestItem_artist on Artist {
    internalID @required(action: NONE)
    coverArtwork {
      image {
        url(version: "thumbnail")
      }
    }
    initials @required(action: NONE)
    name
    formattedNationalityAndBirthday
  }
`
