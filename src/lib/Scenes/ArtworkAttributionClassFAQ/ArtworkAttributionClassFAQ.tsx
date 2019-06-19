import { BorderBox, Box, Button, Flex, Serif, Spacer, Theme } from "@artsy/palette"
import { ArtworkAttributionClassFAQ_artworkAttributionClasses } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { ArtworkAttributionClassFAQRendererQuery } from "__generated__/ArtworkAttributionClassFAQRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"

interface Props {
  artworkAttributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses
}

const OkButton = styled(Button)`
  width: 100%;
`

export class ArtworkAttributionClassFAQ extends React.Component<Props> {
  renderAttributionClass(name: string, longDescription: string) {
    return (
      <>
        <Serif size="4t" weight="semibold">
          {name}
        </Serif>
        <Serif size="4t">{longDescription}</Serif>
        <Spacer m={1} />
      </>
    )
  }
  render() {
    const { artworkAttributionClasses } = this.props
    console.log("PROPS!!", this.props.artworkAttributionClasses)
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
          <Serif size="8">Artwork classifications</Serif>
          <Spacer m={2} />
          {attributionClasses}
          <BorderBox>
            <OkButton width="100%">Ok</OkButton>
          </BorderBox>
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

export const ArtworkAttributionClassFAQRenderer: React.SFC = () => {
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
      render={renderWithLoadProgress(ArtworkAttributionClassFAQContainer)}
    />
  )
}
