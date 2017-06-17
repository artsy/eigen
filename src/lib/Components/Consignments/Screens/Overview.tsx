import * as React from "react"
import { NavigatorIOS, Route, View, ViewProperties } from "react-native"
import { LargeHeadline, Subtitle } from "../Typography"

import TODO from "../Components/ArtworkConsignmentTodo"
import Artist from "./Artist"
import Welcome from "./Welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
}

export default class Info extends React.Component<Props, any> {
  goToArtistTapped = () => this.props.navigator.push({ component: Artist, passProps: this.props })
  goToPhotosTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.props })
  goToMetadataTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.props })
  goToLocationTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.props })
  goToProvenanceTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.props })

  render() {
    const title = "Complete work details to submit"
    const subtitle = "Provide as much detail as possible so that our partners can best assess your work."

    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <LargeHeadline>{title}</LargeHeadline>
        <Subtitle>{subtitle}</Subtitle>

        <TODO
          goToArtist={this.goToArtistTapped}
          goToPhotos={this.goToPhotosTapped}
          goToMetadata={this.goToMetadataTapped}
          goToLocation={this.goToLocationTapped}
          goToProvenance={this.goToProvenanceTapped}
        />
      </View>
    )
  }
}
