import {
  Box,
  Button,
  CloseIcon,
  Join,
  Screen,
  Separator,
  Spacer,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { ArtworkAttributionClassFAQQuery } from "__generated__/ArtworkAttributionClassFAQQuery.graphql"
import { ArtworkAttributionClassFAQ_artworkAttributionClasses$data } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useAndroidGoBack } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  artworkAttributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses$data
}

export const ArtworkAttributionClassFAQ: React.FC<Props> = ({ artworkAttributionClasses }) => {
  const space = useSpace()
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

  useAndroidGoBack()
  return (
    <Screen>
      {!enableNewNavigation && (
        <Screen.Header
          leftElements={
            <Touchable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => goBack()}
              hitSlop={{ top: space(2), left: space(2), bottom: space(2), right: space(2) }}
            >
              <CloseIcon fill="black100" />
            </Touchable>
          }
        />
      )}

      <Screen.Body>
        <ScrollView>
          <Box py={2}>
            <Join separator={<Spacer y={2} />}>
              <Text variant="lg-display">Artwork classifications</Text>

              <Join separator={<Spacer y={1} />}>
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
                Our partners are responsible for providing accurate classification information for
                all works.
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
      environment={getRelayEnvironment()}
      query={ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY}
      variables={{}}
      render={renderWithLoadProgress(ArtworkAttributionClassFAQContainer, props)}
    />
  )
}
