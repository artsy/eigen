import { OwnerType } from "@artsy/cohesion"
import { Button, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { ConsignmentAttributionClass } from "__generated__/SubmitArtworkFormEditQuery.graphql"
import { SubmitArtworkFromMyCollectionArtworksQuery } from "__generated__/SubmitArtworkFromMyCollectionArtworksQuery.graphql"
import { SubmitArtworkFromMyCollectionArtworks_me$key } from "__generated__/SubmitArtworkFromMyCollectionArtworks_me.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { PAGE_SIZE } from "app/Components/constants"
import { fetchArtworkInformation } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { acceptableCategoriesForSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { dismissModal, switchTab } from "app/system/navigation/navigate"
import { getAttributionClassValueByName } from "app/utils/artworkRarityClassifications"
import { extractNodes } from "app/utils/extractNodes"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { useFormikContext } from "formik"
import { compact } from "lodash"
import { useState } from "react"
import { Alert } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const SubmitArtworkFromMyCollectionArtworks: React.FC<{}> = () => {
  const { navigateToNextStep } = useSubmissionContext()
  const [isLoading, setIsLoading] = useState(false)

  const queryData = useLazyLoadQuery<SubmitArtworkFromMyCollectionArtworksQuery>(
    submitArtworkFromMyCollectionQuery,
    submitArtworkFromMyCollectionQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    SubmitArtworkFromMyCollectionArtworksQuery,
    SubmitArtworkFromMyCollectionArtworks_me$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.myCollectionConnection)

  const RefreshControl = useRefreshControl(refetch)

  const { setValues, values } = useFormikContext<ArtworkDetailsFormModel>()

  const handlePress = async (artworkID: string) => {
    try {
      setIsLoading(true)
      // The fetching happens really quickly so we add a delay
      // to show the loading modal for a bit longer
      await setTimeout(() => {}, 1000)
      // Fetch Artwork Details
      const artwork = await fetchArtworkInformation(artworkID)
      if (artwork) {
        // By setting the path for each image we make sure the image will be uploaded to S3
        // and processed by Gemini.
        const photos =
          compact(
            artwork.images?.map((image) => {
              const imageURL = image?.imageURL
              if (!imageURL) {
                return null
              }

              return {
                height: image?.height || undefined,
                isDefault: image?.isDefault || undefined,
                imageURL: imageURL,
                path: imageURL.replace(":version", "large"),
                width: image?.width || undefined,
              }
            })
          ) || []

        // Although ideally we would set the type as a partial here,
        // that will make us quickly forget to update the type when we add new fields/screens
        // This is a tradeoff between type safety and ease of development
        const formValues: ArtworkDetailsFormModel = {
          submissionId: values.submissionId,
          artist: artwork.artist?.displayLabel || "",
          artistId: artwork.artist?.internalID || "",
          artistSearchResult: {
            imageUrl: artwork.artist?.imageUrl || "",
            href: artwork.artist?.href || "",
            internalID: artwork.artist?.internalID || "",
            displayLabel: artwork.artist?.displayLabel || "",
            __typename: "Artist",
          },
          attributionClass:
            (getAttributionClassValueByName(
              artwork.attributionClass?.name
            ) as ConsignmentAttributionClass) || undefined,
          category: acceptableCategoriesForSubmission().find(
            (category) => category.label === artwork.category
          )?.value as any,
          depth: artwork.depth || "",
          dimensionsMetric: artwork.metric || "",
          editionNumber: artwork.editionNumber || "",
          editionSizeFormatted: artwork.editionSize || "",
          height: artwork.height || "",
          location: {
            city: artwork?.location?.city || "",
            state: artwork?.location?.state || "",
            country: artwork?.location?.country || "",
            zipCode: artwork?.location?.postalCode || "",
            countryCode: "",
          },
          medium: artwork.medium || "",
          myCollectionArtworkID: artwork.internalID,
          provenance: artwork.provenance || "",
          // If there is a signature, set it to true, otherwise null
          // This is because the signature field is a boolean
          // Anyway, the user can change it later during the flow
          signature: artwork.signature ? true : null,
          source: "MY_COLLECTION",
          state: "DRAFT",
          utmMedium: "",
          utmSource: "",
          utmTerm: "",
          width: artwork.width || "",
          title: artwork.title || "",
          year: artwork.date || "",

          // Photos
          photos,
          initialPhotos: [],

          // Contact information
          userName: values.userName,
          userEmail: values.userEmail,
          userPhone: values.userPhone,
        }

        setValues(formValues)
        setIsLoading(false)
        navigateToNextStep({
          skipMutation: true,
          step: "AddTitle",
        })
      }
    } catch (error) {
      Alert.alert(
        "Failed to fetch artwork details, ",
        "Please try again or enter details manually."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!artworks.length) {
    return (
      <Flex px={2}>
        <HeaderComponent />

        <Spacer y={4} />
        <Text>
          You have no artworks in{" "}
          <LinkText
            onPress={() => {
              dismissModal()
              switchTab("profile")
            }}
          >
            My Collection.
          </LinkText>{" "}
        </Text>

        <Spacer y={4} />

        <Button
          block
          onPress={() => {
            navigateToNextStep({
              skipMutation: true,
              step: "AddTitle",
            })
          }}
        >
          Add details manually
        </Button>
      </Flex>
    )
  }

  return (
    <Flex flex={1}>
      <MasonryInfiniteScrollArtworkGrid
        artworks={artworks}
        contextScreenOwnerType={OwnerType.submitArtworkStepSelectArtworkMyCollectionArtwork}
        contextScreen={OwnerType.submitArtworkStepSelectArtworkMyCollectionArtwork}
        loadMore={(pageSize) => loadNext(pageSize)}
        hasMore={hasNext}
        isLoading={isLoadingNext}
        onPress={handlePress}
        extraData={artworks}
        hideSaleInfo
        hideSaveIcon
        refreshControl={RefreshControl}
        ListHeaderComponent={HeaderComponent}
      />
      <LoadingModal isVisible={isLoading} dark />
    </Flex>
  )
}

const HeaderComponent: React.FC = () => {
  return (
    <>
      <Text variant="lg">Select artwork from My Collection</Text>
      <Text color="black60" variant="xs">
        You will only see eligible artworks from your Collection
      </Text>
    </>
  )
}
export const submitArtworkFromMyCollectionQueryVariables = {
  count: PAGE_SIZE,
}
const submitArtworkFromMyCollectionQuery = graphql`
  query SubmitArtworkFromMyCollectionArtworksQuery($count: Int, $after: String) {
    me {
      ...SubmitArtworkFromMyCollectionArtworks_me @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment SubmitArtworkFromMyCollectionArtworks_me on Me
  @refetchable(queryName: "SubmitArtworkFromMyCollectionArtworks_meRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    myCollectionConnection(first: $count, after: $after)
      @connection(key: "SubmitArtworkFromMyCollectionArtworks_myCollectionConnection") {
      edges {
        cursor
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
            blurhash
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`
