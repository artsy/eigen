import { Theme } from "@artsy/palette"
import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { FairArtistsContainer as FairArtistsScreen } from "./Screens/FairArtists"
import { FairArtworksContainer as FairArtworksScreen } from "./Screens/FairArtworks"
import { FairDetailContainer as FairDetailScreen } from "./Screens/FairDetail"
import { FairExhibitors as FairExhibitorsScreen } from "./Screens/FairExhibitors"

import { Fair_fair } from "__generated__/Fair_fair.graphql"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  navigator?: NavigatorIOS

  handleViewAllExhibitorsPressed = () => {
    if (!this.navigator) {
      throw new Error("navigator is undefined")
    }

    this.navigator.push({
      component: FairExhibitorsScreen,
      title: "",
      passProps: this.props,
    })
  }

  handleViewAllArtworksPressed = () => {
    if (!this.navigator) {
      throw new Error("navigator is undefined")
    }

    this.navigator.push({
      component: FairArtworksScreen,
      title: "",
      passProps: this.props,
    })
  }

  handleBrowseArtistsPressed = () => {
    if (!this.navigator) {
      throw new Error("navigator is undefined")
    }

    this.navigator.push({
      component: FairArtistsScreen,
      title: "",
      passProps: this.props,
    })
  }

  render() {
    return (
      <Theme>
        <NavigatorIOS
          ref={ref => {
            this.navigator = ref as any
          }}
          navigationBarHidden={true}
          initialRoute={{
            component: FairDetailScreen,
            title: "",
            passProps: {
              ...this.props,
              onViewAllArtworksPressed: this.handleViewAllArtworksPressed,
              onViewAllExhibitorsPressed: this.handleViewAllExhibitorsPressed,
              onBrowseArtistsPressed: this.handleBrowseArtistsPressed,
            },
          }}
          style={{ flex: 1 }}
        />
      </Theme>
    )
  }
}

export const FairContainer = createFragmentContainer(
  Fair,
  graphql`
    fragment Fair_fair on Fair {
      ...FairDetail_fair
      ...FairExhibitors_fair
      ...FairArtists_fair
    }
  `
)
