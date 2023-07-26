import { Button, Flex, Join, Spacer } from "@artsy/palette-mobile"
import {
  MyCollectionCollectedArtistsPrivacyQuery,
  MyCollectionCollectedArtistsPrivacyQuery$data,
} from "__generated__/MyCollectionCollectedArtistsPrivacyQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import {
  HeaderComponent,
  MyCollectionCollectedArtistsPrivacyArtistsList,
} from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsPrivacyArtistsList"
import { dismissModal } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

interface MyCollectionCollectedArtistsPrivacyProps {
  me: MyCollectionCollectedArtistsPrivacyQuery$data["me"]
}

type UpdateUserInterestInput = {
  id: String
  private: Boolean
}

export const MyCollectionCollectedArtistsPrivacy: React.FC<
  MyCollectionCollectedArtistsPrivacyProps
> = ({ me }) => {
  const [userInterestsPrivacy, setUserInterestsPrivacy] = useState<UpdateUserInterestInput[]>([])

  const updateCollectedArtists = (artistId: string, checked: boolean) => {
    const oldUserInterestsPrivacy = [...userInterestsPrivacy]
    const userInterestIndex = oldUserInterestsPrivacy.findIndex((artist) => artist.id === artistId)
    if (userInterestIndex > -1) {
      oldUserInterestsPrivacy[userInterestIndex].private = checked
      setUserInterestsPrivacy(oldUserInterestsPrivacy)
    } else {
      setUserInterestsPrivacy([...oldUserInterestsPrivacy, { id: artistId, private: checked }])
    }
  }

  const handleSave = () => {
    console.warn("not yet ready")
    dismissModal()
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Flex flexGrow={1}>
        <MyCollectionCollectedArtistsPrivacyArtistsList
          me={me!}
          updateCollectedArtists={updateCollectedArtists}
        />
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
    <Flex px={2}>
      <HeaderComponent />
      <Join separator={<Spacer y={2} />}>
        {times(10).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder includeCheckbox />
          </Flex>
        ))}
      </Join>
    </Flex>
  </Flex>
)

export const MyCollectionCollectedArtistsPrivacyQueryRenderer: React.FC<{}> = withSuspense(() => {
  const data = useLazyLoadQuery<MyCollectionCollectedArtistsPrivacyQuery>(
    myCollectionCollectedArtistsPrivacyQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  return <MyCollectionCollectedArtistsPrivacy me={data.me!} />
}, ShareSettingsScreenPlaceholder)

const myCollectionCollectedArtistsPrivacyQuery = graphql`
  query MyCollectionCollectedArtistsPrivacyQuery {
    me {
      ...MyCollectionCollectedArtistsPrivacyArtistsList_me
    }
  }
`
