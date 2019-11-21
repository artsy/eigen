import { Box, Flex, Theme } from "@artsy/palette"
import { Artist_artist } from "__generated__/Artist_artist.graphql"
import About from "lib/Components/Artist/About"
import Artworks from "lib/Components/Artist/Artworks"
import Header from "lib/Components/Artist/Header"
import Shows from "lib/Components/Artist/Shows"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { SwitchEvent } from "lib/Components/SwitchView"
import { Schema, Track, track as _track } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { Component } from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const TABS = {
  ABOUT: "About",
  WORKS: "Works",
  SHOWS: "Shows",
}

interface Props extends ViewProperties {
  artist: Artist_artist
}

interface State {
  selectedTabIndex: number
  selectedTabTitle: string
}

const track: Track<Props, State> = _track

@track()
export class Artist extends Component<Props, State> {
  initialTabState() {
    const tabs = this.availableTabs()
    const worksTab = tabs.indexOf(TABS.WORKS)
    if (worksTab > -1) {
      return { selectedTabIndex: worksTab, selectedTabTitle: TABS.WORKS }
    } else {
      return { selectedTabIndex: 0, selectedTabTitle: tabs[0] }
    }
  }

  componentWillMount() {
    this.setState(this.initialTabState())
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
    const tabs: string[] = []
    const artist = this.props.artist
    const displayAboutSection = artist.has_metadata || artist.counts.articles > 0 || artist.counts.related_artists > 0

    if (displayAboutSection) {
      tabs.push(TABS.ABOUT)
    }

    if (artist.counts.artworks) {
      tabs.push(TABS.WORKS)
    }

    if (artist.counts.partner_shows) {
      tabs.push(TABS.SHOWS)
    }
    return tabs
  }

  selectedTabTitle = () => {
    return this.availableTabs()[this.state.selectedTabIndex]
  }

  renderSelectedTab = () => {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT:
        return <About artist={this.props.artist} />
      case TABS.WORKS:
        return <Artworks artist={this.props.artist} />
      case TABS.SHOWS:
        return <Shows artist={this.props.artist} />
    }
  }

  renderTabView() {
    const { artist } = this.props
    return (
      <StickyTabPage
        headerContent={<Header artist={artist} />}
        tabs={[
          {
            title: "About",
            content: <About artist={artist} />,
          },
          {
            title: "Artworks",
            initial: true,
            content: <Artworks artist={artist} />,
          },
          {
            title: "Shows",
            content: <Shows artist={artist} />,
          },
        ]}
      />
    )
  }

  renderSingleTab() {
    return <Box pt={3}>{this.renderSelectedTab()}</Box>
  }

  render() {
    const displayTabView = this.availableTabs().length > 1

    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>{displayTabView ? this.renderTabView() : this.renderSingleTab()}</Flex>
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
