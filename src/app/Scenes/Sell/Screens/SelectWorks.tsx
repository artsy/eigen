import { Flex, Text } from "@artsy/palette-mobile"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SelectWorksQuery } from "__generated__/SelectWorksQuery.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { useToast } from "app/Components/Toast/toastHook"
import { ToastOptions } from "app/Components/Toast/types"
import {
  SellSelectionNoteBottomSheet,
  SellSelectionWork,
} from "app/Scenes/Sell/Components/SellSelectionNoteBottomSheet"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellWorksSummary, SellWorksSummaryWork } from "app/Scenes/Sell/Components/SellWorksSummary"
import { SellNavigationProp, SellNavigationRoutes } from "app/Scenes/Sell/Sell"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { MAX_SELECTED_WORKS } from "app/Scenes/Sell/constants"
import { useCreateResaleSubmissions } from "app/Scenes/Sell/hooks/useCreateResaleSubmissions"
import {
  ResaleSubmission,
  isResaleSubmissionSellable,
  toResaleSubmission,
} from "app/Scenes/Sell/utils/resaleSubmission"
import { toggleWorkSelection } from "app/Scenes/Sell/utils/toggleWorkSelection"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SelectWorks: React.FC = () => {
  const navigation = useNavigation<SellNavigationProp>()
  const { params } = useRoute<RouteProp<SellNavigationRoutes, "SelectWorks">>()
  const showWorksSummary = !!params?.showWorksSummary
  const setActiveResaleSubmissionID = SellFlowStore.useStoreActions(
    (actions) => actions.setActiveResaleSubmissionID
  )

  const handleHardwareBack = useCallback(() => {
    if (!showWorksSummary) {
      return false
    }

    navigation.setParams({ showWorksSummary: false })
    return true
  }, [navigation, showWorksSummary])

  useBackHandler(handleHardwareBack)

  return (
    <SelectWorksContent
      showWorksSummary={showWorksSummary}
      onShowWorksSummary={() => navigation.setParams({ showWorksSummary: true })}
      onStartSelling={({ resaleSubmission }) => {
        setActiveResaleSubmissionID(resaleSubmission.internalID)
        navigation.navigate("Condition")
      }}
    />
  )
}

interface SelectWorksContentProps {
  showWorksSummary: boolean
  onShowWorksSummary: () => void
  onStartSelling: (work: SellWorksSummaryWork) => void
}

const SelectWorksContent: React.FC<SelectWorksContentProps> = withSuspense({
  Component: ({ showWorksSummary, onShowWorksSummary, onStartSelling }) => {
    // Creating a submission doesn't update this query, so a cached copy would still list the work
    const data = useLazyLoadQuery<SelectWorksQuery>(
      selectWorksQuery,
      {},
      { fetchPolicy: "network-only" }
    )
    const artworks = extractNodes(data.me?.myCollectionConnection)
    const [selectedWorkIDs, setSelectedWorkIDs] = useState<string[]>([])
    const [reviewedWorks, setReviewedWorks] = useState<SellSelectionWork[]>()
    const [verifying, setVerifying] = useState(false)
    const [footerHeight, setFooterHeight] = useState(0)

    const toast = useToast()
    const { submitMutation: createResaleSubmissions } = useCreateResaleSubmissions()
    // Submissions created on this screen; it stays mounted under steps 2 and 3
    const [resaleSubmissionsByArtworkID, setResaleSubmissionsByArtworkID] = useState<
      Record<string, ResaleSubmission>
    >({})

    const selectedArtworks = artworks.filter((artwork) =>
      selectedWorkIDs.includes(artwork.internalID)
    )
    const isSellable = (artworkID: string) =>
      isResaleSubmissionSellable(resaleSubmissionsByArtworkID[artworkID])

    // Both toasts sit just above the button
    const showToast = (message: string, options?: ToastOptions) => {
      toast.show(message, "bottom", { ...options, bottomPadding: footerHeight })
    }

    const toggleWork = (internalID: string) => {
      if (verifying) {
        return
      }

      const nextIDs = toggleWorkSelection(selectedWorkIDs, internalID)

      if (nextIDs) {
        setSelectedWorkIDs(nextIDs)
      } else {
        showToast(`You can select up to ${MAX_SELECTED_WORKS} works at a time.`)
      }
    }

    const showVerifyError = () => {
      showToast("We couldn’t check your works. Please try again.", { backgroundColor: "red100" })
    }

    const verifyWorks = async () => {
      const artworkIDs = selectedWorkIDs.filter((id) => !resaleSubmissionsByArtworkID[id])

      if (artworkIDs.length) {
        setVerifying(true)

        try {
          const response = await createResaleSubmissions({ variables: { input: { artworkIDs } } })
          const created: Record<string, ResaleSubmission> = {}
          response.createResaleSubmissions?.resaleSubmissionsOrErrors.forEach((result) => {
            if (result.__typename === "CreateResaleSubmissionSuccess" && result.resaleSubmission) {
              created[result.artworkID] = toResaleSubmission(result.resaleSubmission)
            }
          })
          setResaleSubmissionsByArtworkID((current) => ({ ...current, ...created }))

          // Works that went through are kept, so trying again only sends the ones that failed
          if (artworkIDs.some((id) => !created[id])) {
            showVerifyError()
            return
          }
        } catch {
          showVerifyError()
          return
        } finally {
          setVerifying(false)
        }
      }

      setReviewedWorks(selectedArtworks)
    }

    if (showWorksSummary) {
      return (
        <SellWorksSummary
          works={selectedArtworks.flatMap((artwork) => {
            const resaleSubmission = resaleSubmissionsByArtworkID[artwork.internalID]
            return isResaleSubmissionSellable(resaleSubmission)
              ? [{ artwork, resaleSubmission }]
              : []
          })}
          onStartSelling={onStartSelling}
        />
      )
    }

    return (
      <>
        <SellStepLayout
          buttonLabel="Verify If Sellable"
          buttonDisabled={!selectedWorkIDs.length}
          buttonLoading={verifying}
          onButtonPress={verifyWorks}
          onFooterHeightChange={setFooterHeight}
        >
          <MasonryInfiniteScrollArtworkGrid
            artworks={artworks}
            selectedArtworkIDs={selectedWorkIDs}
            onPress={(_slug, artwork) => !!artwork && toggleWork(artwork.internalID)}
            hideSaveIcon
            hideSaleInfo
            hidePartner
            hideCuratorsPick
            hideIncreasedInterest
            hideCreateAlertOnArtworkPreview
            disableArtworksListPrompt
            disableProgressiveOnboarding
            // The grid pads its items, so the intro only needs half the screen gutter
            ListHeaderComponent={<SellStepIntro stepName="SelectWorks" px={1} />}
            ListEmptyComponent={
              <Flex>
                <SellStepIntro stepName="SelectWorks" />
                <Text variant="sm" color="mono60">
                  Add works to My Collection to sell them.
                </Text>
              </Flex>
            }
          />
        </SellStepLayout>

        {!!reviewedWorks && (
          <SellSelectionNoteBottomSheet
            visible
            sellableWorks={reviewedWorks.filter((work) => isSellable(work.internalID))}
            unsellableWorks={reviewedWorks.filter((work) => !isSellable(work.internalID))}
            selectedWorkIDs={selectedWorkIDs}
            onToggleWork={toggleWork}
            onProceed={() => {
              setReviewedWorks(undefined)
              onShowWorksSummary()
            }}
            onDismiss={() => setReviewedWorks(undefined)}
          />
        )}
      </>
    )
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: () => (
    <Flex px={2} pt={2}>
      <Text variant="sm" color="mono60">
        We couldn’t load your collection.
      </Text>
    </Flex>
  ),
})

const selectWorksQuery = graphql`
  query SelectWorksQuery {
    me {
      myCollectionConnection(
        first: 50
        sort: CREATED_AT_DESC
        excludeArtworksWithActiveResaleSubmissions: true
      ) {
        edges {
          node {
            id
            internalID
            slug
            artistNames
            title
            image(includeAll: false) {
              aspectRatio
            }
            thumbnail: image {
              url(version: "square")
            }
            ...ArtworkGridItem_artwork
            ...SellWorkCard_artwork
          }
        }
      }
    }
  }
`
