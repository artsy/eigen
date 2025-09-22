import { Box, Button, Join, Screen, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkMediumQuery } from "__generated__/ArtworkMediumQuery.graphql"
import { ArtworkMedium_artwork$data } from "__generated__/ArtworkMedium_artwork.graphql"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  artwork: ArtworkMedium_artwork$data
}

export const ArtworkMedium: React.FC<Props> = ({ artwork }) => {
  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.Header onBack={goBack} />
        <ScrollView>
          <Box px={2}>
            <Join separator={<Spacer y={2} />} flatten>
              {!!artwork.mediumType && (
                <>
                  <Text variant="lg-display">{artwork.mediumType.name}</Text>

                  <Text>{artwork.mediumType.longDescription}</Text>

                  <Separator />
                </>
              )}

              <Text>
                Artsy has nineteen medium types. Medium types are categories that define the
                material or format used to create the artwork.
              </Text>

              <Button onPress={() => goBack()} block>
                OK
              </Button>
            </Join>
          </Box>
        </ScrollView>
      </Screen.Body>
    </Screen>
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
      environment={getRelayEnvironment()}
      query={ARTWORK_MEDIUM_QUERY}
      variables={{ id: props.artworkID }}
      render={renderWithLoadProgress(ArtworkMediumFragmentContainer, props)}
    />
  )
}
