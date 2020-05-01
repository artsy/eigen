import { Box, Flex, Serif, space, Theme } from "@artsy/palette"
import { FairBMWArtActivation_fair } from "__generated__/FairBMWArtActivation_fair.graphql"
import { FairBMWArtActivationQuery } from "__generated__/FairBMWArtActivationQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { BMWSponsorship } from "lib/Scenes/City/CityBMWSponsorship"
import { Schema, screenTrack, track } from "lib/utils/track"
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
  sponsoredContent?: { pressReleaseUrl?: string; activationText?: string }
}

export const shouldShowFairBMWArtActivationLink = (data: ShowMoreMetadataForFairs) => {
  return data.sponsoredContent
}

const PressReleaseContainer = styled(Flex)`
  flex-direction: row;
  margin-top: ${space(9)};
  padding-left: ${space(2)};
  padding-right: ${space(2)};
  margin-bottom: ${space(2)};
  align-items: center;
`

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.BMWFairActivation,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.slug,
  context_screen_owner_id: props.fair.internalID,
}))
export class FairBMWArtActivation extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const {
      fair: { sponsoredContent },
    } = this.props
    const sections = []

    // @ts-ignore STRICTNESS_MIGRATION
    if (sponsoredContent.activationText) {
      sections.push({
        type: "art-activation",
        data: {
          // @ts-ignore STRICTNESS_MIGRATION
          activationText: sponsoredContent.activationText,
        },
      })
    }

    // @ts-ignore STRICTNESS_MIGRATION
    if (sponsoredContent.pressReleaseUrl) {
      sections.push({
        type: "press-release",
        data: {
          // @ts-ignore STRICTNESS_MIGRATION
          pressReleaseUrl: sponsoredContent.pressReleaseUrl,
        },
      })
    }

    // @ts-ignore STRICTNESS_MIGRATION
    this.setState({ sections })
  }

  renderItemSeparator = () => <Box py={3} px={2} />

  @track(eventProps(Schema.ActionNames.PressRelease))
  // @ts-ignore STRICTNESS_MIGRATION
  handleViewPressRelease(url) {
    SwitchBoard.presentNavigationViewController(this, url)
  }
  // @ts-ignore STRICTNESS_MIGRATION
  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "art-activation":
        return (
          <>
            <Serif size="3" lineHeight="20">
              {data.activationText}
            </Serif>
          </>
        )
      case "press-release":
        return (
          <>
            {data.pressReleaseUrl && (
              <CaretButton
                text="View press release"
                onPress={() => this.handleViewPressRelease(data.pressReleaseUrl)}
              />
            )}
          </>
        )
    }
  }

  // @TODO: Implement tests for this component: https://artsyproduct.atlassian.net/browse/LD-549
  render() {
    return (
      <Theme>
        <FlatList
          data={this.state.sections}
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
          ListHeaderComponent={
            <>
              <PressReleaseContainer>
                <Box>
                  <BMWSponsorship logoText="BMW Art Activations" mt={1} ml={1} />
                </Box>
              </PressReleaseContainer>
            </>
          }
          ItemSeparatorComponent={this.renderItemSeparator}
          // @ts-ignore STRICTNESS_MIGRATION
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Theme>
    )
  }
}

function eventProps(actionName: Schema.ActionNames, actionType: Schema.ActionTypes = Schema.ActionTypes.Tap) {
  // @ts-ignore STRICTNESS_MIGRATION
  return props => ({
    action_name: actionName,
    action_type: actionType,
    owner_id: props.fair.internalID,
    owner_slug: props.fair.id,
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

export const FairBMWArtActivationRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => (
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
