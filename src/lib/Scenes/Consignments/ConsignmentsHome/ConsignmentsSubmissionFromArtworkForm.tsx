import { ConsignmentsSubmissionFromArtworkForm_artwork } from "__generated__/ConsignmentsSubmissionFromArtworkForm_artwork.graphql"
import { ConsignmentsSubmissionFromArtworkFormQuery } from "__generated__/ConsignmentsSubmissionFromArtworkFormQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { ConsignmentSetup } from ".."
import { ConnectedOverview as Overview } from "../Screens/Overview"

export interface ConsignmentsSubmissionFromArtworkFormProps {
  utm_term?: string
  utm_medium?: string
  utm_source?: string
  artwork: ConsignmentsSubmissionFromArtworkForm_artwork
}

export const ConsignmentsSubmissionFromArtworkForm: React.FC<ConsignmentsSubmissionFromArtworkFormProps> = (props) => {
  const setup = consignmentSetup(props.artwork)
  console.log("ARTISTARTIST", setup)

  return (
    <View style={{ flex: 1 }}>
      <NavigatorIOS initialRoute={{ component: Overview, passProps: { params: props, setup } }} />
    </View>
  )
}

const ConsignmentsSubmissionFromArtworkFormFragmentContainer = createFragmentContainer(
  ConsignmentsSubmissionFromArtworkForm,
  {
    artwork: graphql`
      fragment ConsignmentsSubmissionFromArtworkForm_artwork on Artwork {
        title
        category
        medium
        width
        height
        depth
        artist {
          internalID
          name
          image {
            url
          }
          targetSupply {
            isTargetSupply
          }
        }
      }
    `,
  }
)

export const ConsignmentsSubmissionFromArtworkFormQueryRenderer: React.FC<{
  artworkSlug: string
}> = ({ artworkSlug }) => {
  return (
    <QueryRenderer<ConsignmentsSubmissionFromArtworkFormQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ConsignmentsSubmissionFromArtworkFormQuery($artworkSlug: String!) {
          artwork(id: $artworkSlug) {
            ...ConsignmentsSubmissionFromArtworkForm_artwork
          }
        }
      `}
      variables={{
        artworkSlug,
      }}
      render={renderWithPlaceholder({
        Container: ConsignmentsSubmissionFromArtworkFormFragmentContainer,
        renderPlaceholder: () => <></>,
      })}
    />
  )
}

const consignmentSetup = (artwork: NonNullable<ConsignmentsSubmissionFromArtworkForm_artwork>): ConsignmentSetup => {
  return {
    metadata: {
      title: artwork?.title!,
      year: null,
      category: artwork?.category!,
      categoryName: artwork?.category!,
      medium: artwork?.medium!,
      width: artwork?.width!,
      height: artwork?.height!,
      depth: 42,
      unit: null,
      displayString: null,
    },
    artist: {
      internalID: artwork.artist?.internalID!,
      name: artwork.artist?.name!,
      image: {
        url: artwork.artist?.image?.url!,
      },
    },
  }
}
