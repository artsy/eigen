import { Theme } from "@artsy/palette"
import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { FairArtworksContainer as FairArtworksScreen } from "./Screens/FairArtworks"
import { FairDetailContainer as FairDetailScreen } from "./Screens/FairDetail"

import { Fair_fair } from "__generated__/Fair_fair.graphql"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  navigator?: NavigatorIOS

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
    }
  `
)
