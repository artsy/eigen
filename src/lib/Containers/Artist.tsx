import { Flex, Theme } from "@artsy/palette"
import { Artist_artist } from "__generated__/Artist_artist.graphql"
import ArtistAbout from "lib/Components/Artist/ArtistAbout"
import ArtistArtworks from "lib/Components/Artist/ArtistArtworks"
import ArtistHeader from "lib/Components/Artist/ArtistHeader"
import ArtistShows from "lib/Components/Artist/ArtistShows"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { SwitchEvent } from "lib/Components/SwitchView"
import { Schema, Track, track as _track } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props extends ViewProperties {
  artist: Artist_artist
}

interface State {
  tabs: any[]
}

const track: Track<Props, State> = _track

@track()
export class Artist extends React.Component<Props, State> {
  state = {
    tabs: [],
  }

  componentWillMount = () => {
    this.availableTabs()
  }

  @track((props, state) => {
    let actionName
    switch (state.selectedTabTitle) {
      case TABS.ABOUT:
        actionName = Schema.ActionNames.ArtistAbout
        break
      case TABS.WORKS:
        actionName = Schema.ActionNames.ArtistWorks
        break
      case TABS.SHOWS:
        actionName = Schema.ActionNames.ArtistShows
        break
    }
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: props.artist.internalID,
      owner_slug: props.artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    }
  })
  tabSelectionDidChange(event: SwitchEvent) {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex, selectedTabTitle: this.selectedTabTitle() })
  }

  availableTabs = () => {
    const tabs = []
    const artist = this.props.artist
    const displayAboutSection = artist.has_metadata || artist.counts.articles > 0 || artist.counts.related_artists > 0

    if (displayAboutSection) {
      tabs.push({
        title: "About",
        content: <ArtistAbout artist={artist} />,
      })
    }

    if (artist.counts.artworks) {
      tabs.push({
        title: "Artworks",
        initial: true,
        content: <ArtistArtworks artist={artist} />,
      })
    }

    if (artist.counts.partner_shows) {
      tabs.push({
        title: "Shows",
        content: <ArtistShows artist={artist} />,
      })
    }

    this.setState({ tabs })
  }

  render() {
    const { artist } = this.props
    const { tabs } = this.state

    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage headerContent={<ArtistHeader artist={artist} />} tabs={tabs} />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}

export default createFragmentContainer(Artist, {
  artist: graphql`
    fragment Artist_artist on Artist {
      internalID
      slug
      has_metadata: hasMetadata
      counts {
        artworks
        partner_shows: partnerShows
        related_artists: relatedArtists
        articles
      }
      ...Header_artist
      ...About_artist
      ...Shows_artist
      ...Artworks_artist
    }
  `,
})
