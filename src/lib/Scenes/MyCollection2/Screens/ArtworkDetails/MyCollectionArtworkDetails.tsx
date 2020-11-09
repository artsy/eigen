import { goBack } from "lib/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { MyCollectionArtworkFormModal } from "../../Components/ArtworkFormModal/MyCollectionArtworkFormModal"

export const MyCollectionArtworkDetails: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <Flex pt="6">
      <Text>Artwork details: {artworkID}</Text>
      <Button onPress={() => setShowModal(true)}>edit artwork</Button>

      <MyCollectionArtworkFormModal
        onDelete={() => {
          goBack()
          goBack()
        }}
        onSuccess={() => {
          setShowModal(false)
        }}
        artwork={null as any}
        mode="edit"
        visible={showModal}
        onDismiss={() => setShowModal(false)}
      />
    </Flex>
  )
}
