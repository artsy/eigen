import { FairBMWArtActivation_fair } from "__generated__/FairBMWArtActivation_fair.graphql"
import { FairBMWArtActivationQuery } from "__generated__/FairBMWArtActivationQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { navigate } from "lib/navigation/navigate"
import { BMWSponsorship } from "lib/Scenes/City/CityBMWSponsorship"
import { Schema, screenTrack, track } from "lib/utils/track"
import { Box, Flex, Serif, space, Theme } from "palette"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props extends ViewProperties {
  fair: FairBMWArtActivation_fair
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

const PressReleaseContainer = styled(Flex)`
  flex-direction: row;
  margin-top: ${space(9)};
  padding-left: ${space(2)};
  padding-right: ${space(2)};
  margin-bottom: ${space(2)};
  align-items: center;
`

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
        content: (
          <Serif size="3" lineHeight="20">
            {sponsoredContent.activationText}
          </Serif>
        ),
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
      <Theme>
        <FlatList
          data={sections}
          renderItem={(item) => <Box px={2}>{item.item.content}</Box>}
          ListHeaderComponent={
            <>
              <PressReleaseContainer>
                <Box>
                  <BMWSponsorship logoText="BMW Art Activations" />
                </Box>
              </PressReleaseContainer>
            </>
          }
          ItemSeparatorComponent={this.renderItemSeparator}
        />
      </Theme>
    )
  }
}

function eventProps(actionName: Schema.ActionNames, actionType: Schema.ActionTypes = Schema.ActionTypes.Tap) {
  return (props: Props) => ({
    action_name: actionName,
    action_type: actionType,
    owner_id: props.fair.internalID,
    owner_slug: props.fair.slug,
    owner_type: Schema.OwnerEntityTypes.Fair,
  })
}

const FairBMWArtActivationFragmentContainer = createFragmentContainer(FairBMWArtActivation, {
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

export const FairBMWArtActivationQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairBMWArtActivationQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairBMWArtActivationQuery($fairID: String!) {
        fair(id: $fairID) {
          ...FairBMWArtActivation_fair
        }
      }
    `}
    variables={{ fairID }}
    render={renderWithLoadProgress(FairBMWArtActivationFragmentContainer)}
  />
)
