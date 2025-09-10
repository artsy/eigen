import { Button, Flex } from "@artsy/palette-mobile"
import {
  MyCollectionCollectedArtistsPrivacyQuery,
  MyCollectionCollectedArtistsPrivacyQuery$data,
} from "__generated__/MyCollectionCollectedArtistsPrivacyQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useToast } from "app/Components/Toast/toastHook"
import {
  HeaderComponent,
  MyCollectionCollectedArtistsPrivacyArtistsList,
} from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacyArtistsList"
import {
  UserInterestsStore,
  UserInterestsStoreProvider,
} from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/UserInterestsStore"
import { updateUserInterests } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/updateUserInterests"
import { popToRoot } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

interface MyCollectionCollectedArtistsPrivacyProps {
  me: MyCollectionCollectedArtistsPrivacyQuery$data["me"]
}

export const MyCollectionCollectedArtistsPrivacy: React.FC<
  MyCollectionCollectedArtistsPrivacyProps
> = ({ me }) => {
  if (!me) {
    return null
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Flex flexGrow={1} flex={1}>
        <MyCollectionCollectedArtistsPrivacyArtistsList me={me} />
      </Flex>

      <SubmitButton />
    </SafeAreaView>
  )
}

const SubmitButton: React.FC = () => {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const userInterests = UserInterestsStore.useStoreState((state) => state.userInterests)

  const handleSubmit = async () => {
    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      await updateUserInterests(userInterests)
      toast.show("Saved", "bottom", {
        backgroundColor: "green100",
      })
      popToRoot()
    } catch (error) {
      toast.show("Failed to update artists privacy", "bottom", {
        backgroundColor: "red100",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex position="absolute" p={2} bottom={0} backgroundColor="mono0">
      <Button block onPress={handleSubmit} loading={isLoading}>
        Done
      </Button>
    </Flex>
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

export const MyCollectionCollectedArtistsPrivacyQueryRenderer: React.FC<{}> = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<MyCollectionCollectedArtistsPrivacyQuery>(
      myCollectionCollectedArtistsPrivacyQuery,
      {},
      { fetchPolicy: "store-and-network" }
    )

    if (!data.me) {
      return null
    }

    return (
      <UserInterestsStoreProvider>
        <MyCollectionCollectedArtistsPrivacy me={data.me} />
      </UserInterestsStoreProvider>
    )
  },
  LoadingFallback: ShareSettingsScreenPlaceholder,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        error={fallbackProps.error}
        trackErrorBoundary={false}
        showCloseButton={true}
        useSafeArea={false}
      />
    )
  },
})

const myCollectionCollectedArtistsPrivacyQuery = graphql`
  query MyCollectionCollectedArtistsPrivacyQuery {
    me {
      ...MyCollectionCollectedArtistsPrivacyArtistsList_me
    }
  }
`
