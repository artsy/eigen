import React from "react"
import { AppState, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import { Theme } from "@artsy/palette"
import { Schema, screenTrack } from "lib/utils/track"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { options } from "lib/options"
import { Router } from "lib/utils/router"

import WorksForYou from "lib/Containers/WorksForYou"
import ForYou from "./Components/ForYou"
import Sales from "./Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import { SalesRenderer } from "lib/Scenes/Home/Components/Sales/Relay/SalesRenderer"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

import { QueryRenderersWorksForYouQueryResponse } from "__generated__/QueryRenderersWorksForYouQuery.graphql"
import { SalesRendererQueryResponse } from "__generated__/SalesRendererQuery.graphql"
import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import TabBar, { Tab } from "lib/Components/TabBar"

const TabBarContainer = styled.View``

interface Props {
  selectedArtist?: string
  selectedTab?: number
  initialTab: number
  tracking: any
  isVisible: boolean
}

interface State {
  appState: string
  selectedTab: number
}

const ArtistsWorksForYouTab = 0
const ForYouTab = 1
const AuctionsTab = 2

const screenSchemaForCurrentTab = currentSelectedTab => {
  let screenType

  if (currentSelectedTab === ArtistsWorksForYouTab) {
    screenType = Schema.PageNames.HomeArtistsWorksForYou
  } else if (currentSelectedTab === ForYouTab) {
    screenType = Schema.PageNames.HomeForYou
  } else if (currentSelectedTab === AuctionsTab) {
    screenType = Schema.PageNames.HomeAuctions
  }

  return screenType
}

/**
 * These trampolines are to support the slightly awkward case where all of the props need to be captured as a single
 * prop, which is because these forward the root Query type.
 *
 * TODO: See if it’s possible to refactor things such that this is no longer necessary.
 */
const WorksForYouTrampoline: React.FC<QueryRenderersWorksForYouQueryResponse> = query => <WorksForYou query={query} />
const SalesTrampoline: React.FC<SalesRendererQueryResponse> = query => <Sales query={query} />

// This kills two birds with one stone:
// It's necessary to wrap all tracks nested in this component, so they dispatch properly
// Also, it'll only fire when the home screen is mounted, the only event we would otherwise miss with our own callbacks
@screenTrack((props: Props) => ({
  context_screen: screenSchemaForCurrentTab(props.initialTab),
  context_screen_owner_type: null,
}))
export default class Home extends React.Component<Props, State> {
  tabView?: ScrollableTabView | any

  constructor(props) {
    super(props)

    this.state = {
      appState: AppState.currentState,
      selectedTab: this.props.initialTab,
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
    // Only if we weren't visible, but we are now, should we fire analytics for this.
    if (newProps.isVisible && !this.props.isVisible) {
      this.fireHomeScreenViewAnalytics()
    }
    if (this.props.selectedTab !== newProps.selectedTab) {
      this.setState({ selectedTab: newProps.selectedTab }, () => this.tabView.goToPage(this.state.selectedTab))
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
    // This option doesn't exist today, so it will be undefined, it can
    // be added to Echo's set of features if we want to disable it.
    const showConsignmentsSash = !options.hideConsignmentsSash
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <ScrollableTabView
            initialPage={this.props.initialTab || ForYouTab}
            ref={tabView => (this.tabView = tabView)}
            onChangeTab={selectedTab => this.setSelectedTab(selectedTab)}
            renderTabBar={props => (
              <TabBarContainer>
                <TabBar spaceEvenly {...props} />
              </TabBarContainer>
            )}
          >
            {/* FIXME:
      A thin space has been added in front of the tab label names to compensate for trailing space added by the
      wider letter-spacing. Going forward, this would ideally be dealt with through letter indentation. */}
            <Tab tabLabel=" Artists">
              <WorksForYouRenderer
                render={renderWithLoadProgress(WorksForYouTrampoline as any)}
                selectedArtist={this.props.selectedArtist}
              />
            </Tab>
            <Tab tabLabel=" For you">
              <ForYouRenderer render={renderWithLoadProgress(ForYou)} />
            </Tab>
            <Tab tabLabel=" Auctions">
              <SalesRenderer render={renderWithLoadProgress(SalesTrampoline as any)} />
            </Tab>
          </ScrollableTabView>
          {!!showConsignmentsSash && (
            <DarkNavigationButton
              title="Sell works from your collection through Artsy"
              onPress={this.openLink.bind(this)}
            />
          )}
        </View>
      </Theme>
    )
  }

  openLink() {
    SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)
  }

  setSelectedTab(selectedTab) {
    this.setState({ selectedTab: selectedTab.i }, this.fireHomeScreenViewAnalytics)
  }

  fireHomeScreenViewAnalytics = () => {
    this.props.tracking.trackEvent({
      context_screen: screenSchemaForCurrentTab(this.state.selectedTab),
      context_screen_owner_type: null,
    })
  }
}
