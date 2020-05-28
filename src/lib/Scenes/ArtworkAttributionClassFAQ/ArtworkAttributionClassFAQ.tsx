import { Box, Button, Sans, Serif, Spacer, Theme } from "@artsy/palette"
import { ArtworkAttributionClassFAQ_artworkAttributionClasses } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { ArtworkAttributionClassFAQRendererQuery } from "__generated__/ArtworkAttributionClassFAQRendererQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  artworkAttributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses
}

export const ArtworkAttributionClassFAQ: React.FC<Props> = ({ artworkAttributionClasses }) => {
  const attributionClasses = artworkAttributionClasses.map((attributionClass, index) => {
    return (
      <React.Fragment key={index}>
        <Serif size="3" weight="semibold">
          {attributionClass.name}
        </Serif>
        <Serif size="3">{attributionClass.longDescription}</Serif>
        <Spacer m={1} />
      </React.Fragment>
    )
  })

  const navRef = useRef<any>(null)
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <Theme>
      <ScrollView ref={navRef}>
        <Box pt={safeAreaInsets.top + 3} pb={safeAreaInsets.top + 4} px={2}>
          <Spacer mt={3} />
          <Serif mb={2} size="8">
            Artwork classifications
          </Serif>
          {attributionClasses}
          <Sans color="black60" size="3" mb={3}>
            Our partners are responsible for providing accurate classification information for all works.
          </Sans>
          <Box height={30}>
            <Button onPress={() => SwitchBoard.dismissNavigationViewController(navRef.current)} block>
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

export const ArtworkAttributionClassFAQRenderer: React.SFC = props => {
  return (
    <QueryRenderer<ArtworkAttributionClassFAQRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtworkAttributionClassFAQRendererQuery {
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
