import React from "react"
import { View } from "react-native"

import { Theme } from "@artsy/palette"
import { Schema, screenTrack } from "lib/utils/track"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { options } from "lib/options"
import { Router } from "lib/utils/router"

import { ForYouRenderer } from "./Components/ForYou/ForYou"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"

interface Props {
  tracking: any
  isVisible: boolean
}

@screenTrack(() => ({
  context_screen: Schema.PageNames.Home,
  context_screen_owner_type: null,
}))
export class Home extends React.Component<Props> {
  // FIXME: Make a proper "viewDidAppear" callback / event emitter
  // https://github.com/artsy/emission/issues/930
  // This is called when the overall home component appears in Eigen
  // We use it to dispatch screen events at that point
  UNSAFE_componentWillReceiveProps(newProps) {
    // Only if we weren't visible, but we are now, should we fire analytics for this.
    if (newProps.isVisible && !this.props.isVisible) {
      // TODO: Do we need this still?
      this.fireHomeScreenViewAnalytics()
    }
  }

  render() {
    // This option doesn't exist today, so it will be undefined, it can
    // be added to Echo's set of features if we want to disable it.
    const showConsignmentsSash = !options.hideConsignmentsSash
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <ForYouRenderer />
          {!!showConsignmentsSash && (
            <DarkNavigationButton
              title="Sell works from your collection through Artsy"
              onPress={() => SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)}
            />
          )}
        </View>
      </Theme>
    )
  }

  fireHomeScreenViewAnalytics = () => {
    this.props.tracking.trackEvent({
      context_screen: Schema.PageNames.Home,
      context_screen_owner_type: null,
    })
  }
}
