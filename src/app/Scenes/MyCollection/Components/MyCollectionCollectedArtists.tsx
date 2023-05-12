import { Text, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtists_me$key } from "__generated__/MyCollectionCollectedArtists_me.graphql"
import { MyCollectionCollectedArtistsRail } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionCollectedArtistsView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsView"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

interface MyCollectionCollectedArtists {
  me: MyCollectionCollectedArtists_me$key
}

export const MyCollectionCollectedArtists: React.FC<MyCollectionCollectedArtists> = ({ me }) => {
  const space = useSpace()
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)
  const data = useFragment(collectedArtistsFragment, me)

  if (!data) {
    return null
  }

  if (selectedTab === "Artists") {
    return <MyCollectionCollectedArtistsView me={data} />
  }

  return <MyCollectionCollectedArtistsRail me={data} />
  return (
    <ScrollView horizontal contentContainerStyle={{ paddingTop: space(2) }}>
      <Text>Collected artists rail</Text>
    </ScrollView>
  )
}

const collectedArtistsFragment = graphql`
  fragment MyCollectionCollectedArtists_me on Me {
    ...MyCollectionCollectedArtistsView_me
    ...MyCollectionCollectedArtistsRail_me
  }
`
