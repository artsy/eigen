import { Button, Checkbox, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useState } from "react"
import { Modal } from "react-native"

interface MyCollectionArtworkFormDeleteArtworkModalProps {
  visible: boolean
  hideModal: () => void
  deleteArtwork: (shouldDeleteArtist: boolean) => void
}

export const MyCollectionArtworkFormDeleteArtworkModal: React.FC<
  MyCollectionArtworkFormDeleteArtworkModalProps
> = ({ visible, hideModal, deleteArtwork }) => {
  const [shouldDeleteArtist, setShouldDeleteArtist] = useState(false)

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      presentationStyle="pageSheet"
      onRequestClose={hideModal}
      animationType="slide"
    >
      <Flex p={2}>
        <Text variant="lg-display">Delete this artwork?</Text>
        <Spacer y={2} />
        <Text variant="sm">This artwork will be removed from My Collection.</Text>
        <Spacer y={4} />
        <Checkbox
          onPress={() => setShouldDeleteArtist(!shouldDeleteArtist)}
          // TODO: Implement disabled logic
          disabled={false}
          justifyContent="center"
          flex={undefined}
          checked={shouldDeleteArtist}
          accessibilityLabel="Remove Amoako Boafo from the artists you collect"
          accessibilityState={{ checked: shouldDeleteArtist }}
          accessibilityHint="If you remove the artist from your collection, they will no longer appear in your profile as a collected artist."
        >
          <Text variant="xs">Remove Amoako Boafo from the artists you collect</Text>
        </Checkbox>
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
}
