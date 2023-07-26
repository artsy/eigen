import { Button, Flex } from "@artsy/palette-mobile"
import {
  MyCollectionCollectedArtistsPrivacyQuery,
  MyCollectionCollectedArtistsPrivacyQuery$data,
} from "__generated__/MyCollectionCollectedArtistsPrivacyQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import {
  ArtistInterestsStore,
  ArtistInterestsStoreProvider,
} from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/ArtistInterestsStore"
import {
  HeaderComponent,
  MyCollectionCollectedArtistsPrivacyArtistsList,
} from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacyArtistsList"
import { dismissModal } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

interface MyCollectionCollectedArtistsPrivacyProps {
  me: MyCollectionCollectedArtistsPrivacyQuery$data["me"]
}

export const MyCollectionCollectedArtistsPrivacy: React.FC<
  MyCollectionCollectedArtistsPrivacyProps
> = ({ me }) => {
  const userInterestsPrivacy = ArtistInterestsStore.useStoreState(
    (state) => state.userInterestsPrivacy
  )

  const handleSave = () => {
    console.warn("not yet ready")
    dismissModal()
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Flex flexGrow={1}>
        <MyCollectionCollectedArtistsPrivacyArtistsList me={me!} />
      </Flex>

      <Flex position="absolute" p={2} bottom={0} backgroundColor="white100">
        <Button block onPress={handleSave}>
          Done
        </Button>
      </Flex>
    </SafeAreaView>
  )
}

const ShareSettingsScreenPlaceholder: React.FC<{}> = () => (
  <Flex>
    <Flex>
      <HeaderComponent />
      {times(10).map((index: number) => (
        <Flex px={2} key={index}>
          <ArtistListItemPlaceholder includeCheckbox />
        </Flex>
      ))}
    </Flex>
  </Flex>
)

export const MyCollectionCollectedArtistsPrivacyQueryRenderer: React.FC<{}> = withSuspense(() => {
  const data = useLazyLoadQuery<MyCollectionCollectedArtistsPrivacyQuery>(
    myCollectionCollectedArtistsPrivacyQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  return (
    <ArtistInterestsStoreProvider>
      <MyCollectionCollectedArtistsPrivacy me={data.me!} />
    </ArtistInterestsStoreProvider>
  )
}, ShareSettingsScreenPlaceholder)

const myCollectionCollectedArtistsPrivacyQuery = graphql`
  query MyCollectionCollectedArtistsPrivacyQuery {
    me {
      ...MyCollectionCollectedArtistsPrivacyArtistsList_me
    }
  }
`
