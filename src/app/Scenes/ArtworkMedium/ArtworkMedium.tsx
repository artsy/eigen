import { ArtworkMedium_artwork$data } from "__generated__/ArtworkMedium_artwork.graphql"
import { ArtworkMediumQuery } from "__generated__/ArtworkMediumQuery.graphql"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Box, Button, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface Props {
  artwork: ArtworkMedium_artwork$data
}

export const ArtworkMedium: React.FC<Props> = ({ artwork }) => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <ScrollView>
      <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
        <Box my={3}>
          <Join separator={<Spacer my={1.5} />} flatten>
            {!!artwork.mediumType && (
              <>
                <Text variant="lg">{artwork.mediumType.name}</Text>

                <Text>{artwork.mediumType.longDescription}</Text>

                <Separator />
              </>
            )}

            <Text>
              Artsy has nineteen medium types. Medium types are categories that define the material
              or format used to create the artwork.
            </Text>

            <Button onPress={() => goBack()} block>
              OK
            </Button>
          </Join>
        </Box>
      </Box>
    </ScrollView>
  )
}

export const ArtworkMediumFragmentContainer = createFragmentContainer(ArtworkMedium, {
  artwork: graphql`
    fragment ArtworkMedium_artwork on Artwork {
      mediumType {
        name
        longDescription
      }
    }
  `,
})

export const ARTWORK_MEDIUM_QUERY = graphql`
  query ArtworkMediumQuery($id: String!) {
    artwork(id: $id) {
      ...ArtworkMedium_artwork
    }
  }
`

export const ArtworkMediumQueryRenderer: React.FC<{
  artworkID: string
}> = (props) => {
  return (
    <QueryRenderer<ArtworkMediumQuery>
      environment={defaultEnvironment}
      query={ARTWORK_MEDIUM_QUERY}
      variables={{ id: props.artworkID }}
      render={renderWithLoadProgress(ArtworkMediumFragmentContainer, props)}
    />
  )
}
