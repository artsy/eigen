// import "@babel/runtime"

import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, ScrollView, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"

import About from "lib/Components/Artist/About"
import Artworks from "lib/Components/Artist/Artworks"
import Header from "lib/Components/Artist/Header"
import Shows from "lib/Components/Artist/Shows"

import { SwitchEvent } from "lib/Components/SwitchView"
import TabView from "lib/Components/TabView"
import { Schema, Track, track as _track } from "lib/utils/track"

import { Artist_artist } from "__generated__/Artist_artist.graphql"

const isPad = Dimensions.get("window").width > 700

// jest.unmock("lib/utils/track")

const TABS = {
  ABOUT: "ABOUT",
  WORKS: "WORKS",
  SHOWS: "SHOWS",
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
        return <About artist={this.props.artist as any} />
      case TABS.WORKS:
        return <Artworks artist={this.props.artist as any} />
      case TABS.SHOWS:
        return <Shows artist={this.props.artist as any} />
    }
  }

  renderTabView() {
    return (
      <TabView
        titles={this.availableTabs()}
        selectedIndex={this.state.selectedTabIndex}
        onSelectionChange={this.tabSelectionDidChange.bind(this)}
        style={styles.tabView}
      >
        {this.renderSelectedTab()}
      </TabView>
    )
  }

  renderSingleTab() {
    return <View style={{ paddingTop: 30 }}>{this.renderSelectedTab()}</View>
  }

  render() {
    const windowDimensions = Dimensions.get("window")
    const commonPadding = windowDimensions.width > 700 ? 40 : 20
    const displayTabView = this.availableTabs().length > 1

    return (
      <ScrollView scrollsToTop={true} automaticallyAdjustContentInsets={false}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Header artist={this.props.artist as any} />
          {displayTabView ? this.renderTabView() : this.renderSingleTab()}
        </View>
      </ScrollView>
    )
  }
}

interface Styles {
  tabView: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  tabView: {
    width: isPad ? 330 : null,
    marginTop: 30,
    marginBottom: 30,
    alignSelf: isPad ? "center" : null,
  },
})

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
