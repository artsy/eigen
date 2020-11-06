import { navigate } from "lib/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { MyCollectionArtworkFormModal } from "../Components/ArtworkFormModal/MyCollectionArtworkFormModal"

export const MyCollectionArtwork: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <Flex pt="6">
      <Text>Artwork: {artworkID}</Text>
      <Button onPress={() => setShowModal(true)}>edit artwork</Button>
      <Button onPress={() => navigate(`/my-collection/artwork-details/${artworkID}`)}>view more</Button>

      <MyCollectionArtworkFormModal mode="edit" visible={showModal} onDismiss={() => setShowModal(false)} />
    </Flex>
  )
}
