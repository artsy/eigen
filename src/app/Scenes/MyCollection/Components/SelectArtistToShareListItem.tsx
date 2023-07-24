import { Checkbox } from "@artsy/palette-mobile"
import { SelectArtistToShareListItem_artist$key } from "__generated__/SelectArtistToShareListItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface SelectArtistToShareListItemProps {
  artist: SelectArtistToShareListItem_artist$key
  checked: boolean
}

export const SelectArtistToShareListItem: React.FC<SelectArtistToShareListItemProps> = ({
  artist,
  checked,
}) => {
  const artistData = useFragment<SelectArtistToShareListItem_artist$key>(artistFragment, artist)

  return (
    <ArtistListItemContainer
      artist={artistData}
      avatarSize="xs"
      withFeedback
      showFollowButton={false}
      onPress={() => {}}
      RightButton={
        <Checkbox
          mr={1}
          checked={checked}
          accessibilityHint={`Share ${artistData.name} with galleries}`}
          accessibilityState={{ checked }}
          onPress={() => {
            console.warn("not yet ready")
          }}
        />
      }
    />
  )
}

const artistFragment = graphql`
  fragment SelectArtistToShareListItem_artist on Artist {
    internalID
    name
    ...ArtistListItem_artist
  }
`
