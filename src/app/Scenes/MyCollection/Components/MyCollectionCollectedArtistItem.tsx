import { MoreIcon, Touchable } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistItem_artist$key } from "__generated__/MyCollectionCollectedArtistItem_artist.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useMemo } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtistItem {
  artist: MyCollectionCollectedArtistItem_artist$key
  // TODO: Implement compact version of artists grid
  compact?: boolean
  artworksCount: number | null
}

export const MyCollectionCollectedArtistItem: React.FC<ArtistItem> = ({
  artist,
  artworksCount,
}) => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)
  const artistData = useFragment<MyCollectionCollectedArtistItem_artist$key>(artistFragment, artist)

  const RightButton = useMemo(() => {
    return (
      <Touchable
        onPress={() => {
          setViewKind({ viewKind: "Artist", id: artistData.id })
        }}
      >
        <MoreIcon height={18} width={18} />
      </Touchable>
    )
  }, [artistData.id])

  return (
    <ArtistListItemContainer
      artist={artistData}
      uploadsCount={artworksCount}
      showFollowButton={false}
      RightButton={RightButton}
    />
  )
}

const artistFragment = graphql`
  fragment MyCollectionCollectedArtistItem_artist on Artist {
    id
    ...ArtistListItem_artist
  }
`
