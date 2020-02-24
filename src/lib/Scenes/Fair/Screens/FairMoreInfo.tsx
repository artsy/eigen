import { Box, Separator, Serif, Spacer, Theme } from "@artsy/palette"
import { FairMoreInfo_fair } from "__generated__/FairMoreInfo_fair.graphql"
import { FairMoreInfoQuery } from "__generated__/FairMoreInfoQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack, track } from "lib/utils/track"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

const ListHeaderText = styled(Serif)`
  height: 36px;
`

interface Props extends ViewProperties {
  fair: FairMoreInfo_fair
}

interface State {
  sections: Array<{
    type: "about" | "links"
    data: any
  }>
}

interface ShowMoreMetadataForFairs {
  organizer?: { website: string }
  about?: string
  ticketsLink?: string
}

export const shouldShowFairMoreInfo = (data: ShowMoreMetadataForFairs) => {
  return data.ticketsLink || data.about
}

export const shouldGoStraightToWebsite = (data: ShowMoreMetadataForFairs) => {
  return !shouldShowFairMoreInfo(data) && (data.organizer && data.organizer.website)
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.AboutTheFairPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.slug,
  context_screen_owner_id: props.fair.internalID,
}))
export class FairMoreInfo extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    const sections = []

    sections.push({
      type: "about",
      data: {
        about: fair.about,
      },
    })

    if (fair.organizer || fair.ticketsLink) {
      sections.push({
        type: "links",
        data: {
          links: fair.organizer,
          ticketsLink: fair.ticketsLink,
        },
      })
    }

    this.setState({ sections })
  }

  renderItemSeparator = () => (
    <Box py={3} px={2}>
      <Separator />
    </Box>
  )

  @track(props => {
    return {
      action_name: Schema.ActionNames.FairSite,
      action_type: Schema.ActionTypes.Tap,
      owner_id: props.fair.internalID,
      owner_slug: props.fair.id,
      owner_type: Schema.OwnerEntityTypes.Fair,
    } as any
  })
  handleFairSitePress(website) {
    SwitchBoard.presentModalViewController(this, website)
  }

  @track(props => {
    return {
      action_name: Schema.ActionNames.BuyTickets,
      action_type: Schema.ActionTypes.Tap,
      owner_id: props.fair.internalID,
      owner_slug: props.fair.id,
      owner_type: Schema.OwnerEntityTypes.Fair,
    } as any
  })
  handleBuyTicketsPress(ticketsLink) {
    SwitchBoard.presentModalViewController(this, ticketsLink)
  }

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "about":
        return <Serif size="3">{data.about}</Serif>
      case "links":
        return (
          <>
            {data.organizer &&
              data.organizer.website(
                <>
                  <CaretButton text="View fair site" onPress={() => this.handleFairSitePress(data.organizer.website)} />
                  <Spacer m={1} />
                </>
              )}
            {data.ticketsLink && (
              <CaretButton text="Buy tickets" onPress={() => this.handleBuyTicketsPress(data.ticketsLink)} />
            )}
          </>
        )
    }
  }

  render() {
    return (
      <Theme>
        <FlatList
          data={this.state.sections}
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
          ListHeaderComponent={
            <>
              <ListHeaderText size="8" mt={12} px={2}>
                About the fair
              </ListHeaderText>
              <Box py={3} px={2}>
                <Separator />
              </Box>
            </>
          }
          ItemSeparatorComponent={this.renderItemSeparator}
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Theme>
    )
  }
}

const FairMoreInfoFragmentContainer = createFragmentContainer(FairMoreInfo, {
  fair: graphql`
    fragment FairMoreInfo_fair on Fair {
      organizer {
        website
      }
      slug
      internalID
      about
      ticketsLink
    }
  `,
})

export const FairMoreInfoRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairMoreInfoQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairMoreInfoQuery($fairID: String!) {
        fair(id: $fairID) {
          ...FairMoreInfo_fair
        }
      }
    `}
    variables={{ fairID }}
    render={renderWithLoadProgress(FairMoreInfoFragmentContainer)}
  />
)
