import { FollowButton } from "@artsy/palette-mobile"
import { ArtistFollowButtonQuery } from "__generated__/ArtistFollowButtonQuery.graphql"
import { ArtistFollowButton_artist$key } from "__generated__/ArtistFollowButton_artist.graphql"
import { useFollowArtist } from "app/utils/mutations/useFollowArtist"
import { FC } from "react"
import { useLazyLoadQuery, graphql, useFragment } from "react-relay"

interface ArtistFollowButtonProps {
  artist: ArtistFollowButton_artist$key
}

export const ArtistFollowButton: FC<ArtistFollowButtonProps> = ({ artist }) => {
  const data = useFragment(fragment, artist)
  const [commitMutation, isInFlight] = useFollowArtist()

  if (!data) {
    return null
  }

  const handleOnPress = () => {
    commitMutation({
      variables: { input: { artistID: data.internalID, unfollow: data.isFollowed } },
      updater: (store) => {
        store.get(data.internalID)?.setValue(!data.isFollowed, "isFollowed")
      },
    })
  }

  return <FollowButton isFollowed={data.isFollowed} onPress={handleOnPress} loading={isInFlight} />
}

const fragment = graphql`
  fragment ArtistFollowButton_artist on Artist {
    internalID @required(action: NONE)
    isFollowed @required(action: NONE)
  }
`

interface ArtistFollowButtonQueryRendererProps {
  artistID: string
}

export const ArtistFollowButtonQueryRenderer: FC<ArtistFollowButtonQueryRendererProps> = ({
  artistID,
}) => {
  const data = useLazyLoadQuery<ArtistFollowButtonQuery>(query, { id: artistID })

  if (!data.artist) {
    return <FollowButton isFollowed={false} />
  }

  return <ArtistFollowButton artist={data.artist} />
}

const query = graphql`
  query ArtistFollowButtonQuery($id: String!) {
    artist(id: $id) {
      ...ArtistFollowButton_artist
    }
  }
`
