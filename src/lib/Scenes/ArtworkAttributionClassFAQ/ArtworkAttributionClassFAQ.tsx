import { ArtworkAttributionClassFAQ_artworkAttributionClasses } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { ArtworkAttributionClassFAQQuery } from "__generated__/ArtworkAttributionClassFAQQuery.graphql"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Sans, Spacer, Theme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  artworkAttributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses
}

export const ArtworkAttributionClassFAQ: React.FC<Props> = ({ artworkAttributionClasses }) => {
  const attributionClasses = artworkAttributionClasses.map((attributionClass, index) => {
    return (
      <React.Fragment key={index}>
        <Sans size="3" weight="medium">
          {attributionClass.name}
        </Sans>
        <Sans size="3">{attributionClass.longDescription}</Sans>
        <Spacer m={1} />
      </React.Fragment>
    )
  })

  const { safeAreaInsets } = useScreenDimensions()

  return (
    <Theme>
      <ScrollView>
        <Box pt={safeAreaInsets.top + 3} pb={safeAreaInsets.top + 4} px={2}>
          <Spacer mt={3} />
          <Sans mb={2} size="8">
            Artwork classifications
          </Sans>
          {attributionClasses}
          <Sans color="black60" size="3" mb={3}>
            Our partners are responsible for providing accurate classification information for all works.
          </Sans>
          <Box height={30}>
            <Button onPress={goBack} block>
              OK
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Theme>
  )
}

export const ArtworkAttributionClassFAQContainer = createFragmentContainer(ArtworkAttributionClassFAQ, {
  artworkAttributionClasses: graphql`
    fragment ArtworkAttributionClassFAQ_artworkAttributionClasses on AttributionClass @relay(plural: true) {
      name
      longDescription
    }
  `,
})

export const ArtworkAttributionClassFAQQueryRenderer: React.SFC = (props) => {
  return (
    <QueryRenderer<ArtworkAttributionClassFAQQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtworkAttributionClassFAQQuery {
          artworkAttributionClasses {
            ...ArtworkAttributionClassFAQ_artworkAttributionClasses
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(ArtworkAttributionClassFAQContainer, props)}
    />
  )
}
