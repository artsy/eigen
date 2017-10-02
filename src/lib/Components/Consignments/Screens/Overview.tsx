import * as React from "react"

import { NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import Button from "../../Buttons/FlatWhite"
import ConsignmentBG from "../Components/ConsignmentBG"
import { LargeHeadline, Subtitle } from "../Typography"

import { ConsignmentMetadata, ConsignmentSetup, SearchResult } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"

import { Row } from "../Components/FormElements"
import Artist from "./Artist"
import FinalSubmissionQuestions from "./FinalSubmissionQuestions"
import Location from "./Location"
import Metadata from "./Metadata"
import Provenance from "./Provenance"
import SelectFromPhotoLibrary from "./SelectFromPhotoLibrary"
import Welcome from "./Welcome"

import createSubmission from "../Submission/create"
import updateSubmission from "../Submission/update"

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

  goToMetadataTapped = () =>
    this.props.navigator.push({
      component: Metadata,
      passProps: { metadata: this.state.metadata, updateWithMetadata: this.updateMetadata },
    })

  goToLocationTapped = () =>
    this.props.navigator.push({ component: Location, passProps: { updateWithResult: this.updateLocation } })

  updateArtist = (result: SearchResult) => this.updateStateAndMetaphysics({ artist: result })
  updateMetadata = (result: ConsignmentMetadata) => this.updateStateAndMetaphysics({ metadata: result })
  updateProvenance = (result: string) => this.updateStateAndMetaphysics({ provenance: result })
  updateLocation = (city: string, state: string, country: string) =>
    this.updateStateAndMetaphysics({ location: { city, state, country } })

  updateStateAndMetaphysics = (state: any) => this.setState(state, this.updateMetaphysics)

  updateMetaphysics = async () => {
    if (this.state.submission_id) {
      updateSubmission(this.state, this.state.submission_id)
    } else if (this.state.artist) {
      const submission = await createSubmission(this.state)
      this.setState({ submission_id: submission.id })
    }
  }

  submitFinalSubmission = () =>
    this.props.navigator.push({ component: FinalSubmissionQuestions, passProps: { setup: this.state } })

  render() {
    const title = "Complete work details to submit"
    const subtitle = "Provide as much detail as possible so that our partners can best assess your work."
    const state = this.state

    // See https://github.com/artsy/convection/blob/master/app/models/submission.rb for list
    const canSubmit = !!(
      state.artist &&
      state.location &&
      state.metadata &&
      state.metadata.category &&
      state.metadata.title &&
      state.metadata.year
    )

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

            <Row style={{ justifyContent: "center" }}>
              <View style={{ height: 43, width: 320, marginTop: 20, opacity: canSubmit ? 1 : 0.3 }}>
                <Button text="NEXT" onPress={canSubmit && this.submitFinalSubmission} style={{ flex: 1 }} />
              </View>
            </Row>
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
