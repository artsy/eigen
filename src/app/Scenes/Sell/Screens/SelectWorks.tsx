import { Flex, Text } from "@artsy/palette-mobile"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SelectWorksQuery } from "__generated__/SelectWorksQuery.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import {
  SellSelectionNoteBottomSheet,
  SellSelectionWork,
} from "app/Scenes/Sell/Components/SellSelectionNoteBottomSheet"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellWorksSummary } from "app/Scenes/Sell/Components/SellWorksSummary"
import { SellNavigationProp, SellNavigationRoutes } from "app/Scenes/Sell/Sell"
import { isWorkSellable } from "app/Scenes/Sell/utils/isWorkSellable"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SelectWorks: React.FC = () => {
  const navigation = useNavigation<SellNavigationProp>()
  const { params } = useRoute<RouteProp<SellNavigationRoutes, "SelectWorks">>()
  const showWorksSummary = !!params?.showWorksSummary

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
      onStartWork={() => navigation.navigate("Condition")}
    />
  )
}

interface SelectWorksContentProps {
  showWorksSummary: boolean
  onShowWorksSummary: () => void
  onStartWork: (internalID: string) => void
}

const SelectWorksContent: React.FC<SelectWorksContentProps> = withSuspense({
  Component: ({ showWorksSummary, onShowWorksSummary, onStartWork }) => {
    const data = useLazyLoadQuery<SelectWorksQuery>(selectWorksQuery, {})
    const artworks = extractNodes(data.me?.myCollectionConnection)
    const [selectedWorkIDs, setSelectedWorkIDs] = useState<string[]>([])
    const [reviewedWorks, setReviewedWorks] = useState<SellSelectionWork[]>()

    const selectedArtworks = artworks.filter((artwork) =>
      selectedWorkIDs.includes(artwork.internalID)
    )

    const toggleWork = (internalID: string) => {
      setSelectedWorkIDs((ids) =>
        ids.includes(internalID) ? ids.filter((id) => id !== internalID) : [...ids, internalID]
      )
    }

    if (showWorksSummary) {
      return (
        <SellWorksSummary
          works={selectedArtworks.filter((artwork) => isWorkSellable(artwork.internalID))}
          onStartWork={onStartWork}
        />
      )
    }

    return (
      <>
        <SellStepLayout
          buttonLabel="Verify If Sellable"
          buttonDisabled={!selectedWorkIDs.length}
          onButtonPress={() => setReviewedWorks(selectedArtworks)}
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
            ListEmptyComponent={
              <Flex px={2} pt={2}>
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
            works={reviewedWorks}
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
        We couldn't load your collection.
      </Text>
    </Flex>
  ),
})

const selectWorksQuery = graphql`
  query SelectWorksQuery {
    me {
      myCollectionConnection(first: 50, sort: CREATED_AT_DESC) {
        edges {
          node {
            id
            internalID
            slug
            artistNames
            title
            date
            image(includeAll: false) {
              aspectRatio
            }
            thumbnail: image {
              url(version: "square")
            }
            ...ArtworkGridItem_artwork
          }
        }
      }
    }
  }
`
