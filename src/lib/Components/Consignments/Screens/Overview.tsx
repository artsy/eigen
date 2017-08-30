import * as React from "react"

import { NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import ConsignmentBG from "../Components/ConsignmentBG"
import { LargeHeadline, Subtitle } from "../Typography"

import { ConsignmentMetadata, ConsignmentSetup, SearchResult } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"
import Artist from "./Artist"
import Location from "./Location"
import Metadata from "./Metadata"

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
      passProps: { ...this.state, updateWithArtist: this.updateArtist },
    })

  goToProvenanceTapped = () =>
    this.props.navigator.push({
      component: Provenance,
      passProps: { ...this.state, updateWithProvenance: this.updateProvenance },
    })

  goToPhotosTapped = () => this.props.navigator.push({ component: SelectFromPhotoLibrary, passProps: this.props })

  updateArtist = (result: SearchResult) => {
    this.setState({ artist: result })
  }

  goToMetadataTapped = () =>
    this.props.navigator.push({
      component: Metadata,
      passProps: { ...this.state, updateWithMetadata: this.updateMetadata },
    })

  goToLocationTapped = () => this.props.navigator.push({ component: Welcome, passProps: this.state.metadata })

  updateMetadata = (result: ConsignmentMetadata) => this.setState({ metadata: result })
  updateProvenance = (result: string) => this.setState({ provenance: result })

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
