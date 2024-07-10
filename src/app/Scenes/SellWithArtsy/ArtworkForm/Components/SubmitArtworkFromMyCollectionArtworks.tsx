import { OwnerType } from "@artsy/cohesion"
import { Button, Flex, LinkText, Message, Spacer, Text } from "@artsy/palette-mobile"
import { SubmitArtworkFromMyCollectionArtworksQuery } from "__generated__/SubmitArtworkFromMyCollectionArtworksQuery.graphql"
import { SubmitArtworkFromMyCollectionArtworks_me$key } from "__generated__/SubmitArtworkFromMyCollectionArtworks_me.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { PAGE_SIZE } from "app/Components/constants"
import { fetchArtworkInformation } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation"
import { getInitialSubmissionFormValuesFromArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/getInitialSubmissionValuesFromArtwork"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { dismissModal, switchTab } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { useFormikContext } from "formik"
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

  const nonSubmittedArtworks = artworks.filter((artwork) => !artwork.submissionId)

  const RefreshControl = useRefreshControl(refetch)

  const { setValues, values } = useFormikContext<ArtworkDetailsFormModel>()

  const handlePress = async (artworkID: string) => {
    try {
      setIsLoading(true)
      // Fetch Artwork Details
      const artwork = await fetchArtworkInformation(artworkID)
      if (artwork) {
        const formValues = {
          ...getInitialSubmissionFormValuesFromArtwork(artwork),
          submissionId: values.submissionId,
          userName: values.userName,
          userEmail: values.userEmail,
          userPhone: values.userPhone,
        }
        setValues(formValues)
        setIsLoading(false)
        navigateToNextStep({
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

  if (!nonSubmittedArtworks.length) {
    return (
      <Flex px={2}>
        <SubmitArtworkFromMyCollectionHeader />
        <Spacer y={2} />
        <Message title="">
          <Text variant="xs" color="black60">
            You have no eligible works in{" "}
            <LinkText
              variant="xs"
              onPress={() => {
                dismissModal()
                switchTab("profile")
              }}
            >
              My Collection.{"\n"}
            </LinkText>{" "}
          </Text>
        </Message>

        <Spacer y={2} />

        <Button
          block
          onPress={() => {
            navigateToNextStep({
              skipMutation: true,
              step: "AddTitle",
            })
          }}
        >
          Add Details Manually
        </Button>
      </Flex>
    )
  }

  return (
    <Flex flex={1}>
      <MasonryInfiniteScrollArtworkGrid
        artworks={nonSubmittedArtworks}
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
        ListHeaderComponent={SubmitArtworkFromMyCollectionHeader}
      />
      <LoadingModal isVisible={isLoading} dark />
    </Flex>
  )
}

export const SubmitArtworkFromMyCollectionHeader: React.FC = () => {
  return (
    <>
      <Text variant="lg-display">Select artwork from My Collection</Text>
      <Spacer y={2} />
      <Text color="black60" variant="xs">
        You will only see eligible artworks. Artworks that have already been submitted won't be
        shown.
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
    myCollectionConnection(
      first: $count
      after: $after
      includeOnlyTargetSupply: true
      sort: CREATED_AT_DESC
    ) @connection(key: "SubmitArtworkFromMyCollectionArtworks_myCollectionConnection") {
      edges {
        cursor
        node {
          id
          slug
          submissionId
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
