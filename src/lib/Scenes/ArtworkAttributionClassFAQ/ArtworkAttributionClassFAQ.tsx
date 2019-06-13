import { Serif, Theme } from "@artsy/palette"
import { ArtworkAttributionClassFAQ_artworkAttributionClasses } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import { ArtworkAttributionClassFAQRendererQuery } from "__generated__/ArtworkAttributionClassFAQRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  attributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses
}

export class ArtworkAttributionClassFAQ extends React.Component<Props> {
  render() {
    console.log("PROPS!!", this.props.attributionClasses)
    return (
      <Theme>
        <Serif size="2">Hello World!</Serif>
      </Theme>
    )
  }
}

export const ArtworkAttributionClassFAQContainer = createFragmentContainer(ArtworkAttributionClassFAQ, {
  artworkAttributionClasses: graphql`
    fragment ArtworkAttributionClassFAQ_artworkAttributionClasses on AttributionClass {
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
