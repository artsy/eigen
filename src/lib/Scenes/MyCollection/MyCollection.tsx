import { navigate } from "lib/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { MyCollectionArtworkFormModal } from "./Screens/MyCollectionArtworkFormModal"

export const MyCollection: React.FC<{}> = ({}) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <Flex pt="6">
      <Text>My Collection</Text>
      <Text>artworks</Text>
      <Button onPress={() => setShowModal(true)}>add new artwork</Button>

      <MyCollectionArtworkFormModal mode="add" visible={showModal} onDismiss={() => setShowModal(false)} />

      <Button onPress={() => navigate(`/my-collection/artwork/${"THE_ID"}`)}>go to artwork</Button>
    </Flex>
  )
}
