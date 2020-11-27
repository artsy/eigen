import { MoreInfo_show } from "__generated__/MoreInfo_show.graphql"
import { MoreInfoQuery } from "__generated__/MoreInfoQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { hideBackButtonOnScroll } from "lib/utils/hideBackButtonOnScroll"
import { Schema, screenTrack, track } from "lib/utils/track"
import { Box, Sans, Separator, Serif, Spacer } from "palette"
import React from "react"
import { FlatList, Linking, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"
import { ShowEventSectionContainer as ShowEventSection } from "../Components/ShowEventSection"
import { TextSection } from "../Components/TextSection"

const ListHeaderText = styled(Serif)`
  height: 36px;
`

interface Props extends ViewProperties {
  show: MoreInfo_show
}

type Section =
  | {
      type: "event"
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      data: { event: MoreInfo_show["events"][number] }
    }
  | {
      type: "pressRelease"
      data: MoreInfo_show
    }
  | {
      type: "galleryWebsite"
      data: MoreInfo_show
    }
  | {
      type: "pressReleaseUrl"
      data: MoreInfo_show
    }
  | {
      type: "receptionText"
      data: string
    }

interface State {
  sections: Section[]
}
@screenTrack<Props>((props) => ({
  context_screen: Schema.PageNames.AboutTheShowPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Show,
  context_screen_owner_slug: props.show.slug,
  context_screen_owner_id: props.show.internalID,
}))
export class MoreInfo extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { show } = this.props

    const sections: Section[] = []

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    show.events.forEach((event) => {
      sections.push({
        type: "event",
        data: { event },
      })
    })

    if (show.openingReceptionText) {
      sections.push({
        type: "receptionText",
        data: show.openingReceptionText,
      })
    }

    if (show.press_release) {
      sections.push({
        type: "pressRelease",
        data: show,
      })
    }

    if (show.pressReleaseUrl) {
      sections.push({
        type: "pressReleaseUrl",
        data: show,
      })
    }

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    if (show.partner.website) {
      sections.push({
        type: "galleryWebsite",
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

  @track((props) => ({
    action_name: Schema.ActionNames.GallerySite,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show.internalID,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  renderGalleryWebsite(url) {
    Linking.openURL(url).catch((err) => console.error("An error occurred opening gallery link", err))
  }

  openPressReleaseLink = () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    navigate(this.props.show.pressReleaseUrl)
  }

  renderItem = ({ item }: { item: Section }) => {
    switch (item.type) {
      case "galleryWebsite":
        return (
          <CaretButton
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            onPress={() => this.renderGalleryWebsite(item.data.partner.website)}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            text={item.data.partner.type === "Gallery" ? "Visit gallery site" : "Visit institution site"}
          />
        )
      case "pressReleaseUrl":
        return <CaretButton onPress={() => this.openPressReleaseLink()} text="View press release" />
      case "receptionText":
        return (
          <>
            <Box mb={2}>
              <Sans size="3t" weight="medium">
                Opening reception
              </Sans>
            </Box>
            <Sans size="3t">{item.data}</Sans>
          </>
        )
      case "event":
        return <ShowEventSection {...item.data} />
      case "pressRelease":
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        return <TextSection title="Press Release" text={item.data.press_release} />
    }
  }

  render() {
    return (
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
        renderItem={(item) => <Box px={2}>{this.renderItem(item)}</Box>}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        keyExtractor={(item, index) => item.type + String(index)}
        onScroll={hideBackButtonOnScroll}
        scrollEventThrottle={100}
      />
    )
  }
}

export const MoreInfoContainer = createFragmentContainer(MoreInfo, {
  show: graphql`
    fragment MoreInfo_show on Show {
      internalID
      slug
      pressReleaseUrl
      openingReceptionText
      partner {
        ... on Partner {
          website
          type
        }
      }
      press_release: pressRelease
      events {
        ...ShowEventSection_event
      }
    }
  `,
})

export const ShowMoreInfoQueryRenderer: React.FC<{ showID: string }> = ({ showID }) => {
  return (
    <QueryRenderer<MoreInfoQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MoreInfoQuery($showID: String!) {
          show(id: $showID) {
            ...MoreInfo_show
          }
        }
      `}
      variables={{ showID }}
      render={renderWithLoadProgress(MoreInfoContainer)}
    />
  )
}
