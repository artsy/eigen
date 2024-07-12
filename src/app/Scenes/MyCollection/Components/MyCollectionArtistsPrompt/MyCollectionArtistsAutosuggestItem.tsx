import { Avatar, Button, CheckIcon, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionArtistsAutosuggestItem_artist$key } from "__generated__/MyCollectionArtistsAutosuggestItem_artist.graphql"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { MotiView } from "moti"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface MyCollectionArtistsAutosuggestItemProps {
  artist: MyCollectionArtistsAutosuggestItem_artist$key
}

export const MyCollectionArtistsAutosuggestItem: FC<MyCollectionArtistsAutosuggestItemProps> = ({
  artist,
}) => {
  const space = useSpace()
  const data = useFragment(QUERY, artist)

  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)
  const addOrRemoveArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addOrRemoveArtist
  )

  if (!data) {
    return null
  }

  const selected = artistIds.includes(data.internalID)
  const displayAvatar = !!data.coverArtwork?.image?.url || !!data.initials

  const handleOnPress = () => {
    addOrRemoveArtist(data.internalID)
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 200 }}
    >
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center" gap={space(1)} flexShrink={1}>
          {!!displayAvatar && (
            <Avatar initials={data.initials} size="xs" src={data.coverArtwork?.image?.url ?? ""} />
          )}

          <Flex flexWrap="wrap">
            <Text variant="sm-display">{data.name}</Text>
            <Text variant="sm-display" color="black60">
              {data.formattedNationalityAndBirthday}
            </Text>
          </Flex>
        </Flex>

        <Button
          size="small"
          icon={selected ? <CheckIcon fill="white100" /> : undefined}
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
