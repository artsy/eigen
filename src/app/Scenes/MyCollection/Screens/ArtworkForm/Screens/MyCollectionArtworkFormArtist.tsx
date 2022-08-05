import { ContextModule, OwnerType } from "@artsy/cohesion"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { MyCollectionArtworkFormArtistQuery } from "__generated__/MyCollectionArtworkFormArtistQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionArtworkFormArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtist">
> = ({ route, navigation }) => {
  const enableArtworksFromNonArtsyArtists = useFeatureFlag("AREnableArtworksFromNonArtsyArtists")
  const tracking = useTracking()

  const queryData = useLazyLoadQuery<MyCollectionArtworkFormArtistQuery>(
    MyCollectionArtworkFormArtistScreenQuery,
    {}
  )

  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const handleResultPress = async (result: AutosuggestResult | ArtistListItem_artist$data) => {
    tracking.trackEvent(tracks.tappedArtist({ artistSlug: result.slug, artistId: result.slug }))
    await GlobalStore.actions.myCollection.artwork.setArtistSearchResult(result)
    navigation.navigate("ArtworkFormArtwork", { ...route.params })
  }

  const handleSkipPress = async () => {
    requestAnimationFrame(() => {
      GlobalStore.actions.myCollection.artwork.updateFormValues({
        metric: preferredMetric,
        pricePaidCurrency: preferredCurrency,
      })
      navigation.navigate("ArtworkFormMain", { ...route.params })
    })
  }

  return (
    <>
      <FancyModalHeader
        hideBottomDivider
        onLeftButtonPress={route.params.onHeaderBackButtonPress}
        rightButtonText="Skip"
        rightButtonTestId="my-collection-artwork-form-artist-skip-button"
        onRightButtonPress={enableArtworksFromNonArtsyArtists ? handleSkipPress : undefined}
      >
        Select an Artist
      </FancyModalHeader>
      <ScreenMargin>
        <ArtistAutosuggest onResultPress={handleResultPress} onSkipPress={handleSkipPress} />
      </ScreenMargin>
    </>
  )
}

const MyCollectionArtworkFormArtistScreenQuery = graphql`
  query MyCollectionArtworkFormArtistQuery {
    me {
      myCollectionInfo {
        ...CollectedArtistList_myCollectionInfo
      }
    }
  }
`

const tracks = {
  tappedArtist: ({ artistId, artistSlug }: { artistId?: string; artistSlug?: string }) => ({
    context_screen: OwnerType.myCollectionAddArtworkArtist,
    context_module: ContextModule.myCollectionAddArtworkAddArtist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
  }),
}
