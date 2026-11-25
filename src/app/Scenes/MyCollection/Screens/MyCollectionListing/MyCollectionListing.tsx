import { Button, Flex, Screen, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { MyCollectionListingQuery } from "__generated__/MyCollectionListingQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionImageView } from "app/Scenes/MyCollection/Components/MyCollectionImageView"
import { MyCollectionListingButton } from "app/Scenes/MyCollection/Screens/MyCollectionListing/Components/MyCollectionListingButton"
import { MyCollectionListingRemoveBottomSheet } from "app/Scenes/MyCollection/Screens/MyCollectionListing/Components/MyCollectionListingRemoveBottomSheet"
import { useCancelResaleSubmission } from "app/Scenes/MyCollection/hooks/useCancelResaleSubmission"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import {
  MY_COLLECTION_REFRESH_KEY,
  refreshMyCollection,
  useRefreshFetchKey,
} from "app/utils/refreshHelpers"
import { useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const IMAGE_WIDTH = 120
const REMOVE_ERROR = "We couldn’t remove this listing. Please try again."

type ResaleSubmission = NonNullable<
  NonNullable<MyCollectionListingQuery["response"]["me"]>["resaleSubmission"]
>

interface MyCollectionListingProps {
  resaleSubmission: ResaleSubmission
}

export const MyCollectionListing: React.FC<MyCollectionListingProps> = ({ resaleSubmission }) => {
  const { internalID, state, statusMessage, priceListed, submittedArtwork } = resaleSubmission
  const toast = useToast()
  const cancelResaleSubmission = useCancelResaleSubmission()
  const [confirming, setConfirming] = useState(false)
  const [removing, setRemoving] = useState(false)

  const canRemove = state === "ACCEPTED" || state === "LISTED"

  const removeListing = () => {
    setRemoving(true)

    cancelResaleSubmission(internalID)
      .then(() => {
        refreshMyCollection()
        goBack()
      })
      .catch(() => {
        setConfirming(false)
        toast.show(REMOVE_ERROR, "bottom", { backgroundColor: "red100" })
      })
      .finally(() => setRemoving(false))
  }

  return (
    <Screen>
      <Screen.Header title="Listing Status" onBack={goBack} />

      <Screen.Body>
        <Screen.ScrollView>
          <Flex flexDirection="row" gap={2}>
            <MyCollectionImageView
              imageURL={submittedArtwork?.image?.url ?? undefined}
              imageWidth={IMAGE_WIDTH}
              aspectRatio={submittedArtwork?.image?.aspectRatio}
              blurhash={submittedArtwork?.image?.blurhash}
              artworkSlug={submittedArtwork?.slug ?? ""}
            />

            <Flex flex={1} gap={0.5}>
              <Text variant="sm-display">{submittedArtwork?.artistNames}</Text>
              <Text variant="sm" color="mono60">
                <Text variant="sm" color="mono60" italic>
                  {submittedArtwork?.title}
                </Text>
                {submittedArtwork?.date ? `, ${submittedArtwork.date}` : ""}
              </Text>
              {!!priceListed?.display && (
                <Text variant="sm" color="mono60">
                  Listed at {priceListed.display}
                </Text>
              )}
            </Flex>
          </Flex>

          <Spacer y={2} />

          <Text variant="sm">{statusMessage}</Text>

          {!!canRemove && (
            <Flex mt={4} gap={1}>
              {state === "ACCEPTED" && (
                <Button
                  block
                  haptic
                  variant="outline"
                  onPress={() =>
                    navigate("/my-collection/sell", {
                      passProps: { resaleSubmissionID: internalID },
                    })
                  }
                >
                  Edit listing
                </Button>
              )}
              <MyCollectionListingButton
                testID="remove-listing-button"
                variant="outline"
                onPress={() => setConfirming(true)}
              >
                Remove listing
              </MyCollectionListingButton>
            </Flex>
          )}
        </Screen.ScrollView>
      </Screen.Body>

      {!!canRemove && (
        <MyCollectionListingRemoveBottomSheet
          visible={confirming}
          removing={removing}
          onConfirm={removeListing}
          onDismiss={() => setConfirming(false)}
        />
      )}
    </Screen>
  )
}

interface MyCollectionListingQueryRendererProps {
  resaleSubmissionID: string
}

interface MyCollectionListingBoundaryProps extends MyCollectionListingQueryRendererProps {
  retryKey: number
  onRetry: () => void
}

const MyCollectionListingBoundary = withSuspense<MyCollectionListingBoundaryProps>({
  Component: ({ resaleSubmissionID, retryKey, onRetry }) => {
    const enableSell = useFeatureFlag("AREnableSellMyCollectionArtwork")

    // Deep links reach this route without going through the flagged Listings tab
    useEffect(() => {
      if (!enableSell) {
        goBack()
      }
    }, [enableSell])

    if (!enableSell) {
      return null
    }

    return (
      <MyCollectionListingContent
        resaleSubmissionID={resaleSubmissionID}
        retryKey={retryKey}
        onRetry={onRetry}
      />
    )
  },
  LoadingFallback: () => (
    <Screen>
      <Screen.Header onBack={goBack} />
      <Flex flex={1} alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    </Screen>
  ),
  ErrorFallback: (fallbackProps, { onRetry }) => (
    <MyCollectionListingLoadFailure
      error={fallbackProps.error}
      onRetry={() => {
        onRetry()
        fallbackProps.resetErrorBoundary()
      }}
    />
  ),
})

// Relay keeps a failed query in its cache, so a retry needs a new fetchKey to refetch.
export const MyCollectionListingQueryRenderer: React.FC<MyCollectionListingQueryRendererProps> = ({
  resaleSubmissionID,
}) => {
  const [retryKey, setRetryKey] = useState(0)

  return (
    <MyCollectionListingBoundary
      resaleSubmissionID={resaleSubmissionID}
      retryKey={retryKey}
      onRetry={() => setRetryKey((key) => key + 1)}
    />
  )
}

const MyCollectionListingContent: React.FC<MyCollectionListingBoundaryProps> = ({
  resaleSubmissionID,
  retryKey,
  onRetry,
}) => {
  const refreshKey = useRefreshFetchKey(MY_COLLECTION_REFRESH_KEY)

  const data = useLazyLoadQuery<MyCollectionListingQuery>(
    myCollectionListingQuery,
    { resaleSubmissionID },
    { fetchKey: `${retryKey}-${refreshKey}`, fetchPolicy: "store-and-network" }
  )

  if (!data.me?.resaleSubmission) {
    return <MyCollectionListingLoadFailure onRetry={onRetry} />
  }

  return <MyCollectionListing resaleSubmission={data.me.resaleSubmission} />
}

const MyCollectionListingLoadFailure: React.FC<{ error?: Error; onRetry: () => void }> = ({
  error,
  onRetry,
}) => <LoadFailureView onRetry={onRetry} showBackButton error={error} trackErrorBoundary={false} />

const myCollectionListingQuery = graphql`
  query MyCollectionListingQuery($resaleSubmissionID: String!) @relay_test_operation {
    me {
      resaleSubmission(id: $resaleSubmissionID) {
        internalID
        state
        statusMessage
        priceListed {
          display
        }
        submittedArtwork {
          slug
          artistNames
          title
          date
          image {
            url(version: ["larger", "large", "medium", "small", "square"])
            aspectRatio
            blurhash
          }
        }
      }
    }
  }
`
