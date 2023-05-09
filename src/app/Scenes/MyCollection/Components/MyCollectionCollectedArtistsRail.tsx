import { Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_myCollectionInfo$key } from "__generated__/MyCollectionCollectedArtistsRail_myCollectionInfo.graphql"
import { MyCollectionCollectedArtistsOnlyView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsOnlyView"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

interface MyCollectionCollectedArtistsRail {
  myCollectionInfo: MyCollectionCollectedArtistsRail_myCollectionInfo$key
}

export const MyCollectionCollectedArtistsRail: React.FC<MyCollectionCollectedArtistsRail> = ({
  myCollectionInfo,
}) => {
  const space = useSpace()
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)
  const myCollectionInfoData = useFragment<MyCollectionCollectedArtistsRail_myCollectionInfo$key>(
    collectedArtistsFragment,
    myCollectionInfo
  )

  if (!myCollectionInfoData) {
    return null
  }

  if (selectedTab === "Artists") {
    return <MyCollectionCollectedArtistsOnlyView myCollectionInfo={myCollectionInfoData} />
  }

  return (
    <ScrollView horizontal contentContainerStyle={{ paddingTop: space(2) }}>
      <Text>Collected artists rail</Text>
    </ScrollView>
  )
}

const collectedArtistsFragment = graphql`
  fragment MyCollectionCollectedArtistsRail_myCollectionInfo on MyCollectionInfo {
    ...MyCollectionCollectedArtistsOnlyView_myCollectionInfo
  }
`
