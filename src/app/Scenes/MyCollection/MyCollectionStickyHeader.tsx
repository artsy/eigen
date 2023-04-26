import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionArtworkUploadMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkUploadMessages"
import {
  PurchasedArtworkAddedMessage,
  SubmittedArtworkAddedMessage,
} from "app/Scenes/MyCollection/Screens/Insights/MyCollectionMessages"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { useTracking } from "react-tracking"

interface MyCollectionStickyHeaderProps {
  filtersCount: number
  hasMarketSignals: boolean
  showModal: () => void
  showNewWorksMessage: boolean
  showSeparator: boolean
}

export const MyCollectionStickyHeader: React.FC<MyCollectionStickyHeaderProps> = ({
  showModal,
  showSeparator,
  hasMarketSignals,
  showNewWorksMessage,
  filtersCount,
}) => {
  const { showVisualClue } = useVisualClue()

  const showSubmissionMessage = showVisualClue("ArtworkSubmissionMessage")

  return (
    <Flex>
      <Filters filtersCount={filtersCount} showModal={showModal} showSeparator={showSeparator} />

      <Messages
        showNewWorksMessage={showNewWorksMessage}
        showSubmissionMessage={showSubmissionMessage}
        hasMarketSignals={hasMarketSignals}
      />
    </Flex>
  )
}

const Filters = ({
  filtersCount,
  showModal,
  showSeparator,
}: {
  filtersCount: number
  showModal: () => void
  showSeparator: boolean
}) => {
  const { trackEvent } = useTracking()

  return (
    <ArtworksFilterHeader
      selectedFiltersCount={filtersCount}
      onFilterPress={showModal}
      showSeparator={showSeparator}
    >
      <Button
        data-test-id="add-artwork-button-non-zero-state"
        size="small"
        variant="fillDark"
        onPress={async () => {
          navigate("my-collection/artworks/new", {
            passProps: {
              mode: "add",
              source: Tab.collection,
              onSuccess: popToRoot,
            },
          })
          trackEvent(tracks.addCollectedArtwork())
        }}
        haptic
      >
        Upload Artwork
      </Button>
    </ArtworksFilterHeader>
  )
}

const Messages = ({
  showNewWorksMessage,
  showSubmissionMessage,
  hasMarketSignals,
}: {
  showNewWorksMessage: boolean
  showSubmissionMessage: boolean
  hasMarketSignals: boolean
}) => {
  return (
    <>
      {!!showNewWorksMessage && (
        <PurchasedArtworkAddedMessage
          onClose={() => AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")}
        />
      )}
      {!!showSubmissionMessage && (
        <SubmittedArtworkAddedMessage
          onClose={() => setVisualClueAsSeen("ArtworkSubmissionMessage")}
        />
      )}
      <MyCollectionArtworkUploadMessages
        sourceTab={Tab.collection}
        hasMarketSignals={hasMarketSignals}
      />
    </>
  )
}

const tracks = {
  addCollectedArtwork: (): AddCollectedArtwork => ({
    action: ActionType.addCollectedArtwork,
    context_module: ContextModule.myCollectionHome,
    context_owner_type: OwnerType.myCollection,
    platform: "mobile",
  }),
}
