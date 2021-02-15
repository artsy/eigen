import { ArtworkMedium_artwork } from "__generated__/ArtworkMedium_artwork.graphql"
import { ArtworkMediumQuery } from "__generated__/ArtworkMediumQuery.graphql"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Join, Separator, Spacer, Text, Theme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  artwork: ArtworkMedium_artwork
}

export const ArtworkMedium: React.FC<Props> = ({ artwork }) => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <Theme>
      <ScrollView>
        <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px="2">
          <Box my="3">
            <Join separator={<Spacer my="1.5" />} flatten>
              {!!artwork.mediumType && (
                <>
                  <Text variant="largeTitle">{artwork.mediumType.name}</Text>

                  <Text>{artwork.mediumType.longDescription}</Text>

                  <Separator />
                </>
              )}

              <Text>
                Artsy has nineteen medium types. Medium types are categories that define the material or format used to
                create the artwork.
              </Text>

              <Button onPress={goBack} block>
                OK
              </Button>
            </Join>
          </Box>
        </Box>
      </ScrollView>
    </Theme>
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
      // tslint:disable-next-line: relay-operation-generics
      query={ARTWORK_MEDIUM_QUERY}
      variables={{ id: props.artworkID }}
      render={renderWithLoadProgress(ArtworkMediumFragmentContainer, props)}
    />
  )
}
