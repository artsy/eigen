import { SelectArtistToShareListItem_artist$key } from "__generated__/SelectArtistToShareListItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface SelectArtistToShareListItemProps {
  artist: SelectArtistToShareListItem_artist$key
}

export const SelectArtistToShareListItem: React.FC<SelectArtistToShareListItemProps> = ({
  artist,
}) => {
  const artistData = useFragment<SelectArtistToShareListItem_artist$key>(artistFragment, artist)

  return (
    <ArtistListItemContainer
      artist={artistData}
      avatarSize="xs"
      withFeedback
      showFollowButton={false}
      RightButton={<></>}
    />
  )
}

const artistFragment = graphql`
  fragment SelectArtistToShareListItem_artist on Artist {
    internalID
    ...ArtistListItem_artist
  }
`
