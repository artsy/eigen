import { ArtworkAttributionClassFAQ_artworkAttributionClasses$data } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { ArtworkAttributionClassFAQQuery } from "__generated__/ArtworkAttributionClassFAQQuery.graphql"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Box, Button, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface Props {
  artworkAttributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses$data
}

export const ArtworkAttributionClassFAQ: React.FC<Props> = ({ artworkAttributionClasses }) => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <ScrollView>
      <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
        <Box my={3}>
          <Join separator={<Spacer my={1.5} />}>
            <Text variant="lg">Artwork classifications</Text>

            <Join separator={<Spacer my={1} />}>
              {artworkAttributionClasses.map((attributionClass, index) => {
                return (
                  <React.Fragment key={index}>
                    <Text variant="sm">{attributionClass.name}</Text>

                    <Text>{attributionClass.longDescription}</Text>
                  </React.Fragment>
                )
              })}
            </Join>

            <Separator />

            <Text color="black60">
              Our partners are responsible for providing accurate classification information for all
              works.
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

export const ArtworkAttributionClassFAQContainer = createFragmentContainer(
  ArtworkAttributionClassFAQ,
  {
    artworkAttributionClasses: graphql`
      fragment ArtworkAttributionClassFAQ_artworkAttributionClasses on AttributionClass
      @relay(plural: true) {
        name
        longDescription
      }
    `,
  }
)

export const ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY = graphql`
  query ArtworkAttributionClassFAQQuery {
    artworkAttributionClasses {
      ...ArtworkAttributionClassFAQ_artworkAttributionClasses
    }
  }
`

export const ArtworkAttributionClassFAQQueryRenderer: React.FC = (props) => {
  return (
    <QueryRenderer<ArtworkAttributionClassFAQQuery>
      environment={defaultEnvironment}
      query={ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY}
      variables={{}}
      render={renderWithLoadProgress(ArtworkAttributionClassFAQContainer, props)}
    />
  )
}
