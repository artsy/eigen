import {
  Button,
  Checkbox,
  Flex,
  InfoCircleIcon,
  Message,
  Spacer,
  Text,
  useColor,
} from "@artsy/palette-mobile"
import { MyCollectionArtworkFormDeleteArtworkModalQuery } from "__generated__/MyCollectionArtworkFormDeleteArtworkModalQuery.graphql"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { Modal } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

interface MyCollectionArtworkFormDeleteArtworkModalProps {
  visible: boolean
  hideModal: () => void
  deleteArtwork: (shouldDeleteArtist: boolean) => void
  artistID: string
}

const myCollectionArtworkFormDeleteArtworkModalQuery = graphql`
  query MyCollectionArtworkFormDeleteArtworkModalQuery($artistID: String!) {
    me {
      myCollectionConnection(artistIDs: [$artistID]) @optionalField {
        totalCount
      }
    }
    artist(id: $artistID) {
      name
    }
  }
`

export const MyCollectionArtworkFormDeleteArtworkModal: React.FC<MyCollectionArtworkFormDeleteArtworkModalProps> =
  withSuspense({
    Component: ({ visible, hideModal, deleteArtwork, artistID }) => {
      const color = useColor()

      const data = useLazyLoadQuery<MyCollectionArtworkFormDeleteArtworkModalQuery>(
        myCollectionArtworkFormDeleteArtworkModalQuery,
        {
          artistID: artistID,
        }
      )

      const [shouldDeleteArtist, setShouldDeleteArtist] = useState(false)

      // If the query fails, disable artist deletion. It can be done separetely from the home screen
      const isLastArtwork = (data.me?.myCollectionConnection?.totalCount || 10) === 1

      return (
        <Modal
          visible={visible}
          onDismiss={hideModal}
          presentationStyle="pageSheet"
          onRequestClose={hideModal}
          animationType="slide"
        >
          <Flex p={2} flex={1} backgroundColor={color("background")}>
            <Text variant="lg-display">Delete this artwork?</Text>
            <Spacer y={2} />
            <Text variant="sm">This artwork will be removed from My Collection.</Text>
            <Spacer y={4} />
            <Checkbox
              onPress={() => setShouldDeleteArtist(!shouldDeleteArtist)}
              disabled={!isLastArtwork}
              justifyContent="center"
              flex={undefined}
              checked={shouldDeleteArtist}
              accessibilityLabel={`Remove ${data.artist?.name} from the artists you collect`}
              accessibilityState={{ checked: shouldDeleteArtist }}
              accessibilityHint="If you remove the artist from your collection, they will no longer appear in your profile as a collected artist."
            >
              <Text variant="xs" color={isLastArtwork ? "mono100" : "mono60"}>
                Remove {data.artist?.name} from the artists you collect
              </Text>
            </Checkbox>

            {!isLastArtwork && (
              <>
                <Spacer y={1} />
                <Message
                  variant="default"
                  title="To remove this artist, please remove all their other artworks from My Collection first."
                  IconComponent={() => <InfoCircleIcon width={18} height={18} fill="mono100" />}
                />
              </>
            )}
            <Spacer y={4} />
            <Button
              block
              onPress={() => {
                deleteArtwork(shouldDeleteArtist)
              }}
              haptic="impactHeavy"
              accessibilityLabel="Delete Artwork"
            >
              Delete Artwork
            </Button>
            <Spacer y={2} />
            <Button block variant="outline" onPress={hideModal} haptic accessibilityLabel="Cancel">
              Cancel
            </Button>
          </Flex>
        </Modal>
      )
    },
    LoadingFallback: LoadingModal,
    ErrorFallback: NoFallback,
  })
