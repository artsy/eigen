import React from "react"
import { AppState, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import { Schema, track } from "lib/utils/track"

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
}

interface State {
  appState: string
  selectedTab: number
}

@track()
export default class Home extends React.Component<Props, State> {
  tabView?: ScrollableTabView | any

  constructor(props) {
    super(props)

    this.state = {
      appState: AppState.currentState,
      selectedTab: 0, // default to the WorksForYou view
    }
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange)
  }

  // FIXME: Make a proper "viewDidAppear" callback / event emitter
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
      this.tabView.goToPage(0)
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          initialPage={this.props.selectedTab || 0}
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
    this.setState({ selectedTab: selectedTab.i })
    this.fireHomeScreenViewAnalytics()
  }

  fireHomeScreenViewAnalytics() {
    console.log("hi")
    this.props.tracking.trackEvent({})
  }
}
