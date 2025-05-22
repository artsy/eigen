import { Flex, SimpleMessage } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsQuery } from "__generated__/MyCollectionCollectedArtistsQuery.graphql"
import { MyCollectionCollectedArtists_me$key } from "__generated__/MyCollectionCollectedArtists_me.graphql"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionCollectedArtistsRail } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { MyCollectionCollectedArtistsView } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsView"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { MY_COLLECTION_REFRESH_KEY, useRefreshFetchKey } from "app/utils/refreshHelpers"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface MyCollectionCollectedArtists {
  me: MyCollectionCollectedArtists_me$key
}

export const MyCollectionCollectedArtists: React.FC<MyCollectionCollectedArtists> = ({ me }) => {
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)

  const data = useFragment(collectedArtistsFragment, me)

  if (!data) {
    return null
  }

  if (selectedTab === "Artists") {
    return (
      <Flex px={2}>
        <MyCollectionCollectedArtistsView me={data} showFilter />
      </Flex>
    )
  }

  return <MyCollectionCollectedArtistsRail me={data} />
}

const collectedArtistsFragment = graphql`
  fragment MyCollectionCollectedArtists_me on Me {
    ...MyCollectionCollectedArtistsView_me
    ...MyCollectionCollectedArtistsRail_me
  }
`

export const MyCollectionCollectedArtistsQueryRenderer: React.FC = withSuspense({
  Component: () => {
    const fetchKey = useRefreshFetchKey(MY_COLLECTION_REFRESH_KEY)

    const data = useLazyLoadQuery<MyCollectionCollectedArtistsQuery>(
      myCollectionCollectedArtistsQuery,
      {},
      {
        fetchKey,
        fetchPolicy: "store-and-network",
      }
    )

    if (!data?.me) {
      return <CollectedArtistsError />
    }

    return (
      <MyCollectionArtworksKeywordStore.Provider>
        <MyCollectionCollectedArtistsView me={data.me} showMoreIcon />
      </MyCollectionArtworksKeywordStore.Provider>
    )
  },
  LoadingFallback: () => null,
  ErrorFallback: () => <CollectedArtistsError />,
})

export const myCollectionCollectedArtistsQuery = graphql`
  query MyCollectionCollectedArtistsQuery {
    me {
      ...MyCollectionCollectedArtistsView_me
    }
  }
`

const CollectedArtistsError: React.FC = () => {
  return <SimpleMessage m={2}>Something went wrong.</SimpleMessage>
}
