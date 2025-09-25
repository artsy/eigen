import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Spacer } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import { SimpleErrorMessage } from "app/Components/ErrorView/SimpleErrorMessage"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistAutosuggest } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistAutosuggest"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useTracking } from "react-tracking"

export const MyCollectionArtworkFormArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtist">
> = ({ navigation }) => {
  const tracking = useTracking()

  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const handleResultPress = async (result: AutosuggestResult) => {
    tracking.trackEvent(tracks.tappedArtist({ artistSlug: result.slug, artistId: result.slug }))

    GlobalStore.actions.myCollection.artwork.updateFormValues({
      metric: preferredMetric,
      pricePaidCurrency: preferredCurrency,
    })
    await GlobalStore.actions.myCollection.artwork.setArtistSearchResult(result)

    if (result.isPersonalArtist || result.counts?.artworks === 0) {
      navigation.navigate("ArtworkFormMain")
    } else {
      navigation.navigate("ArtworkFormArtwork")
    }
  }

  const handleSkipPress = async (artistDisplayName: string) => {
    GlobalStore.actions.myCollection.artwork.resetForm()

    navigation.navigate("AddMyCollectionArtist", {
      artistDisplayName: artistDisplayName,
      onSubmit: (values) => {
        GlobalStore.actions.myCollection.artwork.updateFormValues({
          customArtist: values,
          metric: preferredMetric,
        })
        navigation.navigate("ArtworkFormMain")
      },
    })
  }

  const handleBack = () => {
    // TODO: The state doesn't need to be stored in the global store
    GlobalStore.actions.myCollection.artwork.resetForm()
    goBack()
  }

  return (
    <>
      <NavigationHeader hideBottomDivider onLeftButtonPress={handleBack}>
        Select an Artist
      </NavigationHeader>
      <ScreenMargin pb={6}>
        <ErrorBoundary fallback={<SimpleErrorMessage />}>
          <Suspense fallback={<Placeholder />}>
            <ArtistAutosuggest onResultPress={handleResultPress} onSkipPress={handleSkipPress} />
          </Suspense>
        </ErrorBoundary>
      </ScreenMargin>
    </>
  )
}

const tracks = {
  tappedArtist: ({ artistId, artistSlug }: { artistId?: string; artistSlug?: string }) => ({
    context_screen: OwnerType.myCollectionAddArtworkArtist,
    context_module: ContextModule.myCollectionAddArtworkAddArtist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
  }),
}

const Placeholder: React.FC = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox height={50} />
    <Spacer y={2} />
    <PlaceholderText width={250} />
    <Spacer y={4} />
    <PlaceholderText width={180} />
    <Spacer y={2} />
    <AutosuggestResultsPlaceholder />
  </ProvidePlaceholderContext>
)
