import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsOnlyView_myCollectionInfo$key } from "__generated__/MyCollectionCollectedArtistsOnlyView_myCollectionInfo.graphql"
import { MyCollectionCollectedArtistItem } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistItem"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

interface MyCollectionCollectedArtistsOnlyViewProps {
  myCollectionInfo: MyCollectionCollectedArtistsOnlyView_myCollectionInfo$key
}

export const MyCollectionCollectedArtistsOnlyView: React.FC<
  MyCollectionCollectedArtistsOnlyViewProps
> = ({ myCollectionInfo }) => {
  const myCollectionInfoData =
    useFragment<MyCollectionCollectedArtistsOnlyView_myCollectionInfo$key>(
      collectedArtistsFragment,
      myCollectionInfo
    )

  if (!myCollectionInfoData) {
    return null
  }

  const collectedArtists = extractNodes(myCollectionInfoData.collectedArtistsConnection)

  return (
    <Flex pt={2}>
      <Join separator={<Spacer y={2} />}>
        {collectedArtists.map((artist) => {
          return <MyCollectionCollectedArtistItem artist={artist} key={artist.id} />
        })}
      </Join>
    </Flex>
  )
}

const collectedArtistsFragment = graphql`
  fragment MyCollectionCollectedArtistsOnlyView_myCollectionInfo on MyCollectionInfo {
    collectedArtistsConnection(first: 10) {
      edges {
        node {
          id
          ...MyCollectionCollectedArtistItem_artist
        }
      }
    }
  }
`
