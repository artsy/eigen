import { Box, Button, Sans, Serif, Spacer, Theme } from "@artsy/palette"
import { ArtworkAttributionClassFAQ_artworkAttributionClasses } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { ArtworkAttributionClassFAQRendererQuery } from "__generated__/ArtworkAttributionClassFAQRendererQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  safeAreaInsets: SafeAreaInsets
  artworkAttributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses
}

export class ArtworkAttributionClassFAQ extends React.Component<Props> {
  renderAttributionClass(name: string, longDescription: string) {
    return (
      <>
        <Serif size="3" weight="semibold">
          {name}
        </Serif>
        <Serif size="3">{longDescription}</Serif>
        <Spacer m={1} />
      </>
    )
  }
  render() {
    const { artworkAttributionClasses } = this.props
    const attributionClasses = artworkAttributionClasses.map((attributionClass, index) => {
      return (
        <React.Fragment key={index}>
          {this.renderAttributionClass(attributionClass.name, attributionClass.longDescription)}
        </React.Fragment>
      )
    })

    return (
      <Theme>
        <ScrollView>
          <Box pt={this.props.safeAreaInsets.top} pb={this.props.safeAreaInsets.top} px={2}>
            <Spacer mt={3} />
            <Serif mb={2} size="8">
              Artwork classifications
            </Serif>
            {attributionClasses}
            <Sans color="black60" size="3" mb={3}>
              Our partners are responsible for providing accurate classification information for all works.
            </Sans>
            <Box height={30}>
              <Button onPress={() => SwitchBoard.dismissNavigationViewController(this)} block>
                OK
              </Button>
            </Box>
          </Box>
        </ScrollView>
      </Theme>
    )
  }
}

export const ArtworkAttributionClassFAQContainer = createFragmentContainer(ArtworkAttributionClassFAQ, {
  artworkAttributionClasses: graphql`
    fragment ArtworkAttributionClassFAQ_artworkAttributionClasses on AttributionClass @relay(plural: true) {
      name
      longDescription
    }
  `,
})

export const ArtworkAttributionClassFAQRenderer: React.SFC<{ safeAreaInsets: SafeAreaInsets }> = props => {
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
