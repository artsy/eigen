import { Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsRail_me$key } from "__generated__/MyCollectionCollectedArtistsRail_me.graphql"
import { MyCollectionCollectedArtistsOnlyView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsOnlyView"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

interface MyCollectionCollectedArtistsRail {
  me: MyCollectionCollectedArtistsRail_me$key
}

export const MyCollectionCollectedArtistsRail: React.FC<MyCollectionCollectedArtistsRail> = ({
  me,
}) => {
  const space = useSpace()
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)
  const data = useFragment(collectedArtistsFragment, me)

  if (!data) {
    return null
  }

  if (selectedTab === "Artists") {
    return <MyCollectionCollectedArtistsOnlyView me={data} />
  }

  return (
    <ScrollView horizontal contentContainerStyle={{ paddingTop: space(2) }}>
      <Text>Collected artists rail</Text>
    </ScrollView>
  )
}

const collectedArtistsFragment = graphql`
  fragment MyCollectionCollectedArtistsRail_me on Me {
    ...MyCollectionCollectedArtistsOnlyView_me
  }
`
