import { MoreIcon, Touchable, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistItem_artist$key } from "__generated__/MyCollectionCollectedArtistItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useMemo } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtistItem {
  artist: MyCollectionCollectedArtistItem_artist$key
  // TODO: Implement compact version of artists grid
  compact?: boolean
  isPrivate?: boolean
}

export const MyCollectionCollectedArtistItem: React.FC<ArtistItem> = ({ artist, isPrivate }) => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)
  const artistData = useFragment<MyCollectionCollectedArtistItem_artist$key>(artistFragment, artist)
  const space = useSpace()

  const showArtistPreview = () => {
    setViewKind({
      viewKind: "Artist",
      id: artistData.internalID,
    })
  }

  const RightButton = useMemo(() => {
    return (
      <Touchable onPress={showArtistPreview}>
        <MoreIcon height={18} width={18} />
      </Touchable>
    )
  }, [artistData.internalID])

  return (
    <ArtistListItemContainer
      artist={artistData}
      showFollowButton={false}
      withFeedback
      containerStyle={{ paddingHorizontal: space(2) }}
      RightButton={RightButton}
      onPress={showArtistPreview}
      isPrivate={isPrivate}
    />
  )
}

const artistFragment = graphql`
  fragment MyCollectionCollectedArtistItem_artist on Artist {
    internalID
    ...ArtistListItem_artist
  }
`
