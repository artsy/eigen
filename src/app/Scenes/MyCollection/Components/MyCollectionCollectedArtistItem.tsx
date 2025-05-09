import { MyCollectionCollectedArtistItem_artist$key } from "__generated__/MyCollectionCollectedArtistItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { graphql, useFragment } from "react-relay"

interface ArtistItem {
  artist: MyCollectionCollectedArtistItem_artist$key
  // TODO: Implement compact version of artists grid
  compact?: boolean
  isPrivate?: boolean
  interestId: string
  showMoreIcon?: boolean
}

export const MyCollectionCollectedArtistItem: React.FC<ArtistItem> = ({
  artist,
  isPrivate,
  interestId,
  showMoreIcon,
}) => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)
  const artistData = useFragment<MyCollectionCollectedArtistItem_artist$key>(artistFragment, artist)

  const showArtistPreview = () => {
    setViewKind({
      viewKind: "Artist",
      artistId: artistData.internalID,
      interestId: interestId,
    })
  }

  return (
    <ArtistListItemContainer
      artist={artistData}
      showFollowButton={false}
      withFeedback
      disableNavigation
      onPress={showArtistPreview}
      isPrivate={isPrivate}
      showMoreIcon={showMoreIcon}
    />
  )
}

const artistFragment = graphql`
  fragment MyCollectionCollectedArtistItem_artist on Artist {
    internalID
    ...ArtistListItem_artist
  }
`
