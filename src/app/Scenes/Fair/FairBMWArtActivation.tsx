// NOTE: Component copied from original fair directory
import { FairBMWArtActivation_fair$data } from "__generated__/FairBMWArtActivation_fair.graphql"
import { FairBMWArtActivationQuery } from "__generated__/FairBMWArtActivationQuery.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { navigate } from "app/navigation/navigate"
import { BMWSponsorship } from "app/Scenes/City/CityBMWSponsorship"
import { Schema, screenTrack, track } from "app/utils/track"
import { Box, Text } from "palette"
import React from "react"
import { FlatList, ViewProps } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { defaultEnvironment } from "../../relay/createEnvironment"
import renderWithLoadProgress from "../../utils/renderWithLoadProgress"

interface Props extends ViewProps {
  fair: FairBMWArtActivation_fair$data
}

interface State {
  sections: Array<{
    type: "art-activation" | "press-release"
    data: any
  }>
}

interface ShowMoreMetadataForFairs {
  sponsoredContent:
    | { pressReleaseUrl: string | undefined | null; activationText?: string | undefined | null }
    | undefined
    | null
}

export const shouldShowFairBMWArtActivationLink = (data: ShowMoreMetadataForFairs): boolean => {
  return !!data?.sponsoredContent
}

@screenTrack<Props>((props) => ({
  context_screen: Schema.PageNames.BMWFairActivation,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.slug,
  context_screen_owner_id: props.fair.internalID,
}))
export class FairBMWArtActivation extends React.Component<Props, State> {
  renderItemSeparator = () => <Box py={3} px={2} />

  @track(eventProps(Schema.ActionNames.PressRelease))
  handleViewPressRelease(url: string) {
    navigate(url)
  }

  // @TODO: Implement tests for this component: https://artsyproduct.atlassian.net/browse/LD-549
  render() {
    const {
      fair: { sponsoredContent },
    } = this.props
    const sections: Array<{ key: string; content: React.ReactElement }> = []

    if (sponsoredContent?.activationText) {
      sections.push({
        key: "art-activation",
        content: <Text variant="sm">{sponsoredContent.activationText}</Text>,
      })
    }

    if (sponsoredContent?.pressReleaseUrl) {
      sections.push({
        key: "press-release",
        content: (
          <CaretButton
            text="View press release"
            onPress={this.handleViewPressRelease.bind(this, sponsoredContent.pressReleaseUrl)}
          />
        ),
      })
    }
    return (
      <Box px={2} py={6}>
        <FlatList
          data={sections}
          renderItem={(item) => <Box my={1}>{item.item.content}</Box>}
          ListHeaderComponent={
            <Box mt={6} mb={1} display="flex" alignItems="center" flexDirection="row">
              <BMWSponsorship logoText="BMW Art Activations" />
            </Box>
          }
          ItemSeparatorComponent={this.renderItemSeparator}
        />
      </Box>
    )
  }
}

function eventProps(
  actionName: Schema.ActionNames,
  actionType: Schema.ActionTypes = Schema.ActionTypes.Tap
) {
  return (props: Props) => ({
    action_name: actionName,
    action_type: actionType,
    owner_id: props.fair.internalID,
    owner_slug: props.fair.slug,
    owner_type: Schema.OwnerEntityTypes.Fair,
  })
}

export const FairBMWArtActivationFragmentContainer = createFragmentContainer(FairBMWArtActivation, {
  fair: graphql`
    fragment FairBMWArtActivation_fair on Fair {
      slug
      internalID
      sponsoredContent {
        activationText
        pressReleaseUrl
      }
    }
  `,
})

export const FAIR_BMW_ART_ACTIVATION_QUERY = graphql`
  query FairBMWArtActivationQuery($fairID: String!) {
    fair(id: $fairID) {
      ...FairBMWArtActivation_fair
    }
  }
`

export const FairBMWArtActivationQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairBMWArtActivationQuery>
    environment={defaultEnvironment}
    query={FAIR_BMW_ART_ACTIVATION_QUERY}
    variables={{ fairID }}
    render={renderWithLoadProgress(FairBMWArtActivationFragmentContainer)}
  />
)
