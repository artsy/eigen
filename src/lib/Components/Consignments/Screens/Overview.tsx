import * as React from "react"

import { NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import ConsignmentBG from "../Components/ConsignmentBG"
import { LargeHeadline, Subtitle } from "../Typography"

import { ArtistResult, ConsignmentSetup } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"
import Artist from "./Artist"
import Provenance from "./Provenance"
import SelectFromPhotoLibrary from "./SelectFromPhotoLibrary"
import Welcome from "./Welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
  setup: ConsignmentSetup
}

export default class Info extends React.Component<Props, ConsignmentSetup> {
  constructor(props) {
    super(props)
    this.state = props.setup || ({} as ConsignmentSetup)
  }

  goToArtistTapped = () =>
    this.props.navigator.push({
      component: Artist,
      passProps: { ...this.state, updateWithResult: this.updateArtist },
    })

  goToPhotosTapped = () => this.props.navigator.push({ component: SelectFromPhotoLibrary, passProps: this.props })
  goToMetadataTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.props })
  goToLocationTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.props })
  goToProvenanceTapped = () => this.props.navigator.push({ component: Provenance, passProps: this.props })

  updateArtist = (result: ArtistResult) => {
    this.setState({ artist: result })
  }

  updateProvenace = (result: string) => {
    this.setState({ provenance: result })
  }

  render() {
    const title = "Complete work details to submit"
    const subtitle = "Provide as much detail as possible so that our partners can best assess your work."

    return (
      <ConsignmentBG>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ paddingTop: 40 }}>
            <LargeHeadline>
              {title}
            </LargeHeadline>
            <Subtitle>
              {subtitle}
            </Subtitle>

            <TODO
              goToArtist={this.goToArtistTapped}
              goToPhotos={this.goToPhotosTapped}
              goToMetadata={this.goToMetadataTapped}
              goToLocation={this.goToLocationTapped}
              goToProvenance={this.goToProvenanceTapped}
              {...this.state}
            />
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
