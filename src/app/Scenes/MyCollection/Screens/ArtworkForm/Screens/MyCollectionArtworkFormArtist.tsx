import { ContextModule, OwnerType } from "@artsy/cohesion"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { GlobalStore } from "app/store/GlobalStore"
import React from "react"
import { useTracking } from "react-tracking"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionArtworkFormArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtist">
> = ({ route, navigation }) => {
  const tracking = useTracking()
  const handleResultPress = async (result: AutosuggestResult) => {
    tracking.trackEvent(tracks.tappedArtist({ artistSlug: result.slug, artistId: result.slug }))
    await GlobalStore.actions.myCollection.artwork.setArtistSearchResult(result)
    navigation.navigate("ArtworkFormArtwork", { ...route.params })
  }

  return (
    <>
      <FancyModalHeader hideBottomDivider onLeftButtonPress={route.params.onHeaderBackButtonPress}>
        Select an Artist
      </FancyModalHeader>
      <ScreenMargin>
        <ArtistAutosuggest onResultPress={handleResultPress} />
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
