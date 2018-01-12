import React from "react"
import { AppState, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import { Schema, screenTrack } from "lib/utils/track"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"

import WorksForYou from "lib/Containers/WorksForYou"
import ForYou from "./Components/ForYou"
import Sales from "./Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import { SalesRenderer } from "lib/Scenes/Home/Components/Sales/Relay/SalesRenderer"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import TabBar, { Tab } from "lib/Components/TabBar"

const TabBarContainer = styled.View`
  margin-top: 20px;
`

interface Props {
  selectedArtist?: string
  selectedTab?: number
  tracking: any
}

interface State {
  appState: string
  selectedTab: number
}

const ArtistsWorksForYouTab = 0
const ForYouTab = 1
const AuctionsTab = 2

// This kills two birds with one stone:
// It's necessary to wrap all tracks nested in this component, so they dispatch properly
// Also, it'll only fire when the home screen is mounted, the only event we would otherwise miss with our own callbacks
@screenTrack({
  context_screen: Schema.PageNames.HomeArtistsWorksForYou,
  context_screen_owner_type: null,
})
export default class Home extends React.Component<Props, State> {
  tabView?: ScrollableTabView | any

  constructor(props) {
    super(props)

    this.state = {
      appState: AppState.currentState,
      selectedTab: ArtistsWorksForYouTab, // default to the WorksForYou view
    }
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange)
  }

  // FIXME: Make a proper "viewDidAppear" callback / event emitter
  // https://github.com/artsy/emission/issues/930
  // This is called when the overall home component appears in Eigen
  // We use it to dispatch screen events at that point
  componentWillReceiveProps(newProps) {
    if (newProps.isVisible) {
      this.fireHomeScreenViewAnalytics()
    }
  }

  _handleAppStateChange = nextAppState => {
    // If we are coming back to the app from the background with a selected artist, make sure we're on the Artists tab
    if (this.props.selectedArtist && this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      this.tabView.goToPage(ArtistsWorksForYouTab)
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          initialPage={this.props.selectedTab || ArtistsWorksForYouTab}
          ref={tabView => (this.tabView = tabView)}
          onChangeTab={selectedTab => this.setSelectedTab(selectedTab)}
          renderTabBar={props => (
            <TabBarContainer>
              <TabBar {...props} />
            </TabBarContainer>
          )}
        >
          {/* FIXME:
      A thin space has been added in front of the tab label names to compensate for trailing space added by the
      wider letter-spacing. Going forward, this would ideally be dealt with through letter indentation. */}
          <Tab tabLabel=" Artists">
            <WorksForYouRenderer
              render={renderWithLoadProgress(WorksForYou)}
              selectedArtist={this.props.selectedArtist}
            />
          </Tab>
          <Tab tabLabel=" For You">
            <ForYouRenderer render={renderWithLoadProgress(ForYou)} />
          </Tab>
          <Tab tabLabel=" Auctions">
            <SalesRenderer render={renderWithLoadProgress(Sales)} />
          </Tab>
        </ScrollableTabView>

        <DarkNavigationButton
          title="Sell works from your collection through Artsy"
          onPress={this.openLink.bind(this)}
        />
      </View>
    )
  }

  openLink() {
    SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)
  }

  setSelectedTab(selectedTab) {
    this.setState({ selectedTab: selectedTab.i }, this.fireHomeScreenViewAnalytics)
  }

  fireHomeScreenViewAnalytics = () => {
    let screenType

    if (this.state.selectedTab === ArtistsWorksForYouTab) {
      screenType = Schema.PageNames.HomeArtistsWorksForYou
    } else if (this.state.selectedTab === ForYouTab) {
      screenType = Schema.PageNames.HomeForYou
    } else if (this.state.selectedTab === AuctionsTab) {
      screenType = Schema.PageNames.HomeAuctions
    }
    this.props.tracking.trackEvent({
      context_screen: screenType,
      context_screen_owner_type: null,
    })
  }
}
