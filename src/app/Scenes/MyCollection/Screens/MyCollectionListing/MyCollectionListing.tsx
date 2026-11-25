import { Button, Flex, Image, Screen, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { MyCollectionListingQuery } from "__generated__/MyCollectionListingQuery.graphql"
import { MyCollectionListing_resaleSubmission$key } from "__generated__/MyCollectionListing_resaleSubmission.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useToast } from "app/Components/Toast/toastHook"
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
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const IMAGE_WIDTH = 120
const REMOVE_ERROR = "We couldn’t remove this listing. Please try again."

interface MyCollectionListingProps {
  resaleSubmission: MyCollectionListing_resaleSubmission$key
}

export const MyCollectionListing: React.FC<MyCollectionListingProps> = ({ resaleSubmission }) => {
  const {
    internalID,
    isCancelable,
    isEditable,
    state,
    statusMessage,
    priceListed,
    submittedArtwork,
  } = useFragment(fragment, resaleSubmission)
  const toast = useToast()
  const cancelResaleSubmission = useCancelResaleSubmission()
  const [confirming, setConfirming] = useState(false)
  const [removing, setRemoving] = useState(false)

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
      <Screen.Header onBack={goBack} />

      <Screen.Body>
        <Screen.ScrollView>
          <Flex flexDirection="row" gap={2}>
            {submittedArtwork?.image?.url ? (
              <Image
                src={submittedArtwork.image.url}
                width={IMAGE_WIDTH}
                aspectRatio={submittedArtwork.image.aspectRatio}
                blurhash={submittedArtwork.image.blurhash}
              />
            ) : (
              <Flex width={IMAGE_WIDTH} height={IMAGE_WIDTH} bg="mono10" />
            )}

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
                  {state === "LISTED" ? "Listed at" : "Asking price"} {priceListed.display}
                </Text>
              )}
            </Flex>
          </Flex>

          <Spacer y={2} />

          <Text variant="sm">{statusMessage}</Text>

          {!!(isEditable || isCancelable) && (
            <Flex mt={4} gap={1}>
              {!!isEditable && (
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
              {!!isCancelable && (
                <Button
                  block
                  haptic
                  testID="remove-listing-button"
                  variant="text"
                  onPress={() => setConfirming(true)}
                >
                  <Text variant="sm" color="red100">
                    Remove listing
                  </Text>
                </Button>
              )}
            </Flex>
          )}
        </Screen.ScrollView>
      </Screen.Body>

      {!!isCancelable && (
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

const fragment = graphql`
  fragment MyCollectionListing_resaleSubmission on ResaleSubmission {
    internalID
    isCancelable
    isEditable
    state
    statusMessage
    priceListed {
      display
    }
    submittedArtwork {
      artistNames
      title
      date
      image {
        url(version: ["medium", "small"])
        aspectRatio
        blurhash
      }
    }
  }
`

const myCollectionListingQuery = graphql`
  query MyCollectionListingQuery($resaleSubmissionID: String!) @relay_test_operation {
    me {
      resaleSubmission(id: $resaleSubmissionID) {
        ...MyCollectionListing_resaleSubmission
      }
    }
  }
`
