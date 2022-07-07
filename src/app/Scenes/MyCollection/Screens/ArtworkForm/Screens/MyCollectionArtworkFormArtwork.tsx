import { ActionType, ContextModule, OwnerType, TappedSkip } from "@artsy/cohesion"
import { StackScreenProps } from "@react-navigation/stack"
import { MyCollectionArtworkFormArtworkQuery } from "__generated__/MyCollectionArtworkFormArtworkQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { omit, pickBy } from "lodash"
import { Spacer } from "palette"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import { fetchQuery, graphql } from "relay-runtime"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArtistSearchResult } from "../Components/ArtistSearchResult"
import { ArtworkAutosuggest } from "../Components/ArtworkAutosuggest"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionArtworkFormArtwork: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtwork">
> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false)

  const { formik } = useArtworkForm()
  const { trackEvent } = useTracking()
  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  useEffect(() => {
    // Navigate back to the artist search screen if no artist is selected.
    if (!formik.values.artistSearchResult) {
      navigation.navigate("ArtworkFormArtist", { ...route.params })
    }
  }, [formik.values.artistSearchResult])

  const updateFormValues = async (artworkId: string) => {
    setLoading(true)

    try {
      const artworkData = await fetchArtwork(artworkId)

      if (!artworkData) {
        return
      }

      const filteredFormValues = omit(
        pickBy(artworkData, (value) => value !== null),
        ["images"]
      )

      // By setting the path for each image we make sure the image will be uploaded to S3
      // and processed by Gemini.
      const photos = artworkData.images?.map((image) => ({
        height: image?.height || undefined,
        isDefault: image?.isDefault || undefined,
        imageURL: image?.imageURL || undefined,
        path: image?.imageURL?.replace(":version", "large") || undefined,
        width: image?.width || undefined,
      }))

      GlobalStore.actions.myCollection.artwork.updateFormValues({
        metric: preferredMetric,
        pricePaidCurrency: preferredCurrency,
        ...filteredFormValues,
        photos,
      })
    } catch (error) {
      console.error("Couldn't load artwork data", error)
    } finally {
      requestAnimationFrame(() => {
        setLoading(false)
        navigateToNext()
      })
    }
  }

  const onSkip = () => {
    trackEvent(
      tracks.tappedOnSkip(
        formik.values.artistSearchResult?.internalID!,
        formik.values.artistSearchResult?.slug!,
        "Skip choosing artwork"
      )
    )

    requestAnimationFrame(() => {
      GlobalStore.actions.myCollection.artwork.updateFormValues({
        metric: preferredMetric,
        pricePaidCurrency: preferredCurrency,
      })
      navigateToNext()
    })
  }

  const navigateToNext = () => navigation.navigate("ArtworkFormMain", { ...route.params })

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={route.params.onHeaderBackButtonPress}
        rightButtonText="Skip"
        rightButtonTestId="my-collection-artwork-form-artwork-skip-button"
        onRightButtonPress={onSkip}
        hideBottomDivider
      >
        Select an Artwork
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <ScreenMargin>
          {!!formik.values.artistSearchResult && (
            <ArtistSearchResult result={formik.values.artistSearchResult} />
          )}
          <Spacer mb={2} />
          <ArtworkAutosuggest onResultPress={updateFormValues} onSkipPress={onSkip} />
        </ScreenMargin>
      </ScrollView>
      <LoadingModal isVisible={loading} />
    </>
  )
}

const fetchArtwork = async (
  artworkID: string
): Promise<MyCollectionArtworkFormArtworkQuery["response"]["artwork"] | undefined> => {
  const result = await fetchQuery<MyCollectionArtworkFormArtworkQuery>(
    defaultEnvironment,
    graphql`
      query MyCollectionArtworkFormArtworkQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          medium: category
          date
          depth
          editionSize
          editionNumber
          height
          images {
            height
            isDefault
            imageURL
            width
          }
          isEdition
          category: medium
          metric
          title
          width
        }
      }
    `,
    { artworkID }
  ).toPromise()

  return result?.artwork
}

const tracks = {
  tappedOnSkip: (internalID: string, slug: string, subject: string) => {
    const tappedOnSkip: TappedSkip = {
      action: ActionType.tappedSkip,
      context_screen_owner_type: OwnerType.myCollectionAddArtworkArtist,
      context_module: ContextModule.myCollectionAddArtworkAddArtist,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      subject,
    }
    return tappedOnSkip
  },
}
