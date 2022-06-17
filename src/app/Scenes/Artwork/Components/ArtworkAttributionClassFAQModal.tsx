import { NavigationContainer } from "@react-navigation/native"
import { ArtworkAttributionClassFAQModalQuery } from "__generated__/ArtworkAttributionClassFAQModalQuery.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Box, Button, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArtworkAttributionClassFAQModalProps {
  visible: boolean
  onClose: () => void
}

export const ArtworkAttributionClassFAQModal: React.FC<ArtworkAttributionClassFAQModalProps> = ({
  visible,
  onClose,
}) => {
  const data = useLazyLoadQuery<ArtworkAttributionClassFAQModalQuery>(
    ArtworkAttributionClassQuery,
    {},
    {}
  )

  if (!data.artworkAttributionClasses) {
    return null
  }

  return (
    <NavigationContainer independent>
      <FancyModal visible={visible} onBackgroundPressed={onClose}>
        <FancyModalHeader rightCloseButton onRightButtonPress={onClose}>
          <Text variant="lg">Artwork classifications</Text>
        </FancyModalHeader>

        <ScrollView>
          <Box flex={1} px={2} py={4}>
            <Join separator={<Spacer my={1.5} />}>
              <Join separator={<Spacer my={1} />}>
                {data.artworkAttributionClasses.map((attributionClass, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Text variant="sm">{attributionClass?.name ?? ""}</Text>

                      <Text>{attributionClass?.longDescription ?? ""}</Text>
                    </React.Fragment>
                  )
                })}
              </Join>

              <Separator />

              <Text color="black60">
                Our partners are responsible for providing accurate classification information for
                all works.
              </Text>

              <Button onPress={onClose} block>
                OK
              </Button>
            </Join>
          </Box>
        </ScrollView>
      </FancyModal>
    </NavigationContainer>
  )
}

export const ArtworkAttributionClassQuery = graphql`
  query ArtworkAttributionClassFAQModalQuery {
    artworkAttributionClasses {
      name
      longDescription
    }
  }
`
