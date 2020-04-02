import React from "react"
import { View } from "react-native"

import { Theme } from "@artsy/palette"
import { Schema, screenTrack } from "lib/utils/track"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { options } from "lib/options"
import { Router } from "lib/utils/router"

import { ForYouRenderer } from "./Components/ForYou/ForYou"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"

@screenTrack(() => ({
  context_screen: Schema.PageNames.Home,
  context_screen_owner_type: null,
}))
export class Home extends React.Component {
  render() {
    // This could be defined in Echo, but has never been.
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
}
