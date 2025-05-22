import { ActionType, ContextModule, OwnerType, TappedSkip } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { MyCollectionArtworkFormArtworkQuery } from "__generated__/MyCollectionArtworkFormArtworkQuery.graphql"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkAutosuggest } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtworkAutosuggest"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { GlobalStore } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { getAttributionClassValueByName } from "app/utils/artworkRarityClassifications"
import { omit, pickBy } from "lodash"
import React, { useEffect, useState } from "react"
import { fetchQuery, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export const MyCollectionArtworkFormArtwork: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtwork">
> = ({ navigation }) => {
  const [loading, setLoading] = useState(false)

  const { formik } = useArtworkForm()
  const { trackEvent } = useTracking()
  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  useEffect(() => {
    // Navigate back to the artist search screen if no artist is selected.
    if (!formik.values.artistSearchResult) {
      navigation.navigate("ArtworkFormArtist")
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
        attributionClass:
          getAttributionClassValueByName(artworkData.attributionClass?.name) || undefined,
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

  const onSkip = (artworkTitle?: string) => {
    GlobalStore.actions.myCollection.artwork.updateFormValues({
      title: artworkTitle,
    })

    if (
      !!formik.values.artistSearchResult?.internalID &&
      !!formik.values.artistSearchResult?.slug
    ) {
      trackEvent(
        tracks.tappedOnSkip(
          formik.values.artistSearchResult.internalID,
          formik.values.artistSearchResult.slug,
          "Skip choosing artwork"
        )
      )
    }

    requestAnimationFrame(() => {
      GlobalStore.actions.myCollection.artwork.updateFormValues({
        metric: preferredMetric,
        pricePaidCurrency: preferredCurrency,
      })
      navigateToNext()
    })
  }

  const navigateToNext = () => navigation.navigate("ArtworkFormMain")

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <>
      <NavigationHeader
        onLeftButtonPress={handleBackButtonPress}
        rightButtonText="Skip"
        onRightButtonPress={onSkip}
        hideBottomDivider
      >
        Select an Artwork
      </NavigationHeader>
      <Flex flex={1} px={2}>
        {!!formik.values.artistSearchResult && (
          <ArtistSearchResult result={formik.values.artistSearchResult} />
        )}
        <Spacer y={2} />
        <ArtworkAutosuggest onResultPress={updateFormValues} onSkipPress={onSkip} />
      </Flex>
      <LoadingModal isVisible={loading} />
    </>
  )
}

const fetchArtwork = async (
  artworkID: string
): Promise<MyCollectionArtworkFormArtworkQuery["response"]["artwork"] | undefined> => {
  const result = await fetchQuery<MyCollectionArtworkFormArtworkQuery>(
    getRelayEnvironment(),
    graphql`
      query MyCollectionArtworkFormArtworkQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          medium
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
          attributionClass {
            name
          }
          isEdition
          category
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
