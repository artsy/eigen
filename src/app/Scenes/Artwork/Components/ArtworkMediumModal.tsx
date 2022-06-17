import { NavigationContainer } from "@react-navigation/native"
import { ArtworkMediumModal_artwork$data } from "__generated__/ArtworkMediumModal_artwork.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Box, Button, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkMediumModalProps {
  artwork: ArtworkMediumModal_artwork$data
  visible: boolean
  onClose: () => void
}

export const ArtworkMediumModal: React.FC<ArtworkMediumModalProps> = ({
  artwork,
  visible,
  onClose,
}) => {
  if (!artwork?.mediumType) {
    return null
  }

  return (
    <NavigationContainer independent>
      <FancyModal visible={visible} onBackgroundPressed={onClose}>
        <FancyModalHeader rightCloseButton onRightButtonPress={onClose}>
          <Text variant="lg">{artwork.mediumType.name}</Text>
        </FancyModalHeader>
        <Box flex={1} px={2} py={4}>
          <Join separator={<Spacer my={1.5} />}>
            <Text>{artwork.mediumType.longDescription}</Text>

            <Separator />

            <Text>
              Artsy has nineteen medium types. Medium types are categories that define the material
              or format used to create the artwork.
            </Text>

            <Button onPress={onClose} block>
              OK
            </Button>
          </Join>
        </Box>
      </FancyModal>
    </NavigationContainer>
  )
}

export const ArtworkMediumModalFragmentContainer = createFragmentContainer(ArtworkMediumModal, {
  artwork: graphql`
    fragment ArtworkMediumModal_artwork on Artwork {
      mediumType @required(action: NONE) {
        name
        longDescription
      }
    }
  `,
})
