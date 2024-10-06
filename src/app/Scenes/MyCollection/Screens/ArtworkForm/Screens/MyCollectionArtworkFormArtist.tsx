import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Spacer } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistAutosuggest } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistAutosuggest"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
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
      props: {
        artistDisplayName: artistDisplayName,
        onSubmit: (values) => {
          GlobalStore.actions.myCollection.artwork.updateFormValues({
            customArtist: values,
            metric: preferredMetric,
          })
          navigation.navigate("ArtworkFormMain")
        },
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
      <FancyModalHeader hideBottomDivider onLeftButtonPress={handleBack}>
        Select an Artist
      </FancyModalHeader>
      <ScreenMargin>
        <Suspense fallback={<Placeholder />}>
          <ArtistAutosuggest onResultPress={handleResultPress} onSkipPress={handleSkipPress} />
        </Suspense>
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
