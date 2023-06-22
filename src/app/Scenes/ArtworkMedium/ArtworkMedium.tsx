import { Spacer, Text, Separator, Button, Box } from "@artsy/palette-mobile"
import { ArtworkMediumQuery } from "__generated__/ArtworkMediumQuery.graphql"
import { ArtworkMedium_artwork$data } from "__generated__/ArtworkMedium_artwork.graphql"
import { BottomAlignedButtonWrapper } from "app/Components/Buttons/BottomAlignedButtonWrapper"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useAndroidGoBack } from "app/utils/hooks/useBackHandler"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  artwork: ArtworkMedium_artwork$data
}

export const ArtworkMedium: React.FC<Props> = ({ artwork }) => {
  useAndroidGoBack()

  const buttonComponent = (
    <Box m={2}>
      <Button onPress={() => dismissModal()} block>
        OK
      </Button>
      <Spacer y={1} />
    </Box>
  )

  return (
    <BottomAlignedButtonWrapper buttonComponent={buttonComponent}>
      <FancyModalHeader useXButton onLeftButtonPress={() => dismissModal()}>
        Medium
      </FancyModalHeader>
      <Box mt={2} ml={2} mr={2}>
        {!!artwork.mediumType && (
          <>
            <Text variant="lg-display">{artwork.mediumType.name}</Text>
            <Spacer y={2} />
            <Text>{artwork.mediumType.longDescription}</Text>
            <Spacer y={2} />
            <Separator />
            <Spacer y={2} />
          </>
        )}
        <Text>
          Artsy has nineteen medium types. Medium types are categories that define the material or
          format used to create the artwork.
        </Text>
      </Box>
    </BottomAlignedButtonWrapper>
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
