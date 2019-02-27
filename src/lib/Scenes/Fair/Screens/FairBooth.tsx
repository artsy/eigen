import { Box, Separator, Theme } from "@artsy/palette"
import { FairBooth_show } from "__generated__/FairBooth_show.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { FairBoothQuery } from "__generated__/FairBoothQuery.graphql"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "lib/Components/Show/ShowArtistsPreview"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "lib/Components/Show/ShowArtworksPreview"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { FairBoothHeaderContainer as FairBoothHeader } from "../Components/FairBoothHeader"

interface State {
  sections: Array<{ type: "artworks" | "artists"; data: object }>
}

interface Props {
  show: FairBooth_show
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.FairBoothPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.show.id,
  context_screen_owner_id: props.show._id,
}))
export class FairBooth extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  onViewFairBoothArtworksPressed() {
    SwitchBoard.presentNavigationViewController(this, `/show/${this.props.show.id}/artworks`)
  }

  onViewFairBoothArtistsPressed() {
    SwitchBoard.presentNavigationViewController(this, `/show/${this.props.show.id}/artists`)
  }

  componentDidMount() {
    const { show } = this.props
    const sections = []

    sections.push({
      type: "artworks",
      data: {
        show,
        onViewAllArtworksPressed: this.onViewFairBoothArtworksPressed.bind(this),
      },
    })

    sections.push({
      type: "artists",
      data: {
        show,
        onViewAllArtistsPressed: this.onViewFairBoothArtistsPressed.bind(this),
      },
    })
    this.setState({ sections })
  }

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "artworks":
        return <ShowArtworksPreview {...data} />
      case "artists":
        return <ShowArtistsPreview {...data} />
      default:
        return null
    }
  }

  onTitlePressed = partnerId => {
    SwitchBoard.presentNavigationViewController(this, partnerId)
  }

  render() {
    const { sections } = this.state
    const { show } = this.props
    return (
      <Theme>
        <FlatList
          data={sections}
          ListHeaderComponent={<FairBoothHeader show={show} onTitlePressed={this.onTitlePressed} />}
          renderItem={item => (
            <Box px={2} py={2}>
              {this.renderItem(item)}
            </Box>
          )}
          ItemSeparatorComponent={() => {
            return (
              <Box px={2} pb={2} mt={2}>
                <Separator />
              </Box>
            )
          }}
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Theme>
    )
  }
}

export const FairBoothContainer = createFragmentContainer(
  FairBooth,
  graphql`
    fragment FairBooth_show on Show {
      id
      _id
      ...FairBoothHeader_show
      ...ShowArtworksPreview_show
      ...ShowArtistsPreview_show
      ...ShowArtists_show
      ...ShowArtworks_show
    }
  `
)

export const FairBoothRenderer: React.SFC<{ showID: string }> = ({ showID }) => (
  <QueryRenderer<FairBoothQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairBoothQuery($showID: String!) {
        show(id: $showID) {
          ...FairBooth_show
        }
      }
    `}
    variables={{ showID }}
    render={renderWithLoadProgress(FairBoothContainer)}
  />
)
