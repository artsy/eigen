import { Box, Separator, Serif, Spacer, Theme } from "@artsy/palette"
import { MoreInfo_show } from "__generated__/MoreInfo_show.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { Schema, screenTrack, track } from "lib/utils/track"
import React from "react"
import { FlatList, Linking, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { EventSectionContainer as EventSection } from "../Components/EventSection"
import { TextSection } from "../Components/TextSection"

const ListHeaderText = styled(Serif)`
  height: 36px;
`

interface Props extends ViewProperties {
  show: MoreInfo_show
}

interface State {
  sections: Array<{
    type: "event" | "press-release" | "gallery-website"
    data: any
  }>
}
@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.AboutTheShowPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Show,
  context_screen_owner_slug: props.show.id,
  context_screen_owner_id: props.show._id,
}))
export class MoreInfo extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { show } = this.props

    const sections = []

    show.events.forEach(event => {
      sections.push({
        type: "event",
        data: { event },
      })
    })

    if (show.press_release) {
      sections.push({
        type: "press-release",
        data: show,
      })
    }

    if (show.partner.website) {
      sections.push({
        type: "gallery-website",
        data: show,
      })
    }

    this.setState({ sections })
  }

  renderItemSeparator = () => (
    <Box py={3} px={2}>
      <Separator />
    </Box>
  )

  @track(props => ({
    action_name: Schema.ActionNames.GallerySite,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show._id,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  renderGalleryWebsite(url) {
    Linking.openURL(url).catch(err => console.error("An error occurred opening gallery link", err))
  }

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "gallery-website":
        return (
          <CaretButton
            onPress={() => this.renderGalleryWebsite(data.partner.website)}
            text={data.partner.type === "Gallery" ? "Visit gallery site" : "Visit institution site"}
          />
        )
      case "event":
        return <EventSection {...data} />
      case "press-release":
        return <TextSection title="Press Release" text={data.press_release} />
    }
  }

  render() {
    return (
      <Theme>
        <FlatList
          data={this.state.sections}
          ListHeaderComponent={
            <>
              <ListHeaderText size="8" mt={12} px={2}>
                About the show
              </ListHeaderText>
              {this.renderItemSeparator()}
            </>
          }
          ListFooterComponent={<Spacer pb={4} />}
          ItemSeparatorComponent={this.renderItemSeparator}
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Theme>
    )
  }
}

export const MoreInfoContainer = createFragmentContainer(
  MoreInfo,
  graphql`
    fragment MoreInfo_show on Show {
      _id
      id
      exhibition_period
      partner {
        ... on Partner {
          website
          type
        }
      }
      press_release
      events {
        ...EventSection_event
      }
    }
  `
)
