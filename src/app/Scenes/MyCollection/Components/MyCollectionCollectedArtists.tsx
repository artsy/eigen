import { MyCollectionCollectedArtists_me$key } from "__generated__/MyCollectionCollectedArtists_me.graphql"
import { MyCollectionCollectedArtistsRail } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionCollectedArtistsView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsView"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { navigate } from "app/system/navigation/navigate"
import { useEffect } from "react"
import { graphql, useFragment } from "react-relay"

interface MyCollectionCollectedArtists {
  me: MyCollectionCollectedArtists_me$key
}

export const MyCollectionCollectedArtists: React.FC<MyCollectionCollectedArtists> = ({ me }) => {
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)
  const data = useFragment(collectedArtistsFragment, me)
  const wasCollectedArtistsOnboardingSeen = MyCollectionTabsStore.useStoreState(
    (state) => state.wasCollectedArtistsOnboardingSeen
  )
  const setCollectedArtistsOnboardingAsSeen = MyCollectionTabsStore.useStoreActions(
    (actions) => actions.setCollectedArtistsOnboardingAsSeen
  )

  useEffect(() => {
    if (data && wasCollectedArtistsOnboardingSeen === false) {
      setTimeout(() => {
        navigate("/my-collection/onboarding/artists-collected")
        setCollectedArtistsOnboardingAsSeen()
      }, 2000)
    } else {
      setCollectedArtistsOnboardingAsSeen()
    }
  }, [wasCollectedArtistsOnboardingSeen])

  if (!data) {
    return null
  }

  if (selectedTab === "Artists") {
    return <MyCollectionCollectedArtistsView me={data} />
  }

  return <MyCollectionCollectedArtistsRail me={data} />
}

const collectedArtistsFragment = graphql`
  fragment MyCollectionCollectedArtists_me on Me {
    ...MyCollectionCollectedArtistsView_me
    ...MyCollectionCollectedArtistsRail_me
  }
`
