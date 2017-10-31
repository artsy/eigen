import * as React from "react"

import {
  AsyncStorage,
  Image,
  NavigatorIOS,
  Route,
  ScrollView,
  TouchableHighlight,
  View,
  ViewProperties,
} from "react-native"

import ConsignmentBG from "../Components/ConsignmentBG"
import { LargeHeadline, Subtitle } from "../Typography"

import { ConsignmentMetadata, ConsignmentSetup, SearchResult } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"

import { Button, Row } from "../Components/FormElements"
import Artist from "./Artist"
import FinalSubmissionQuestions from "./FinalSubmissionQuestions"
import Location from "./Location"
import Metadata from "./Metadata"
import Provenance from "./Provenance"
import SelectFromPhotoLibrary from "./SelectFromPhotoLibrary"
import Welcome from "./Welcome"

import createSubmission from "../Submission/create"
import updateSubmission from "../Submission/update"
import { uploadImageAndPassToGemini } from "../Submission/uploadPhotoToGemini"

const consignmentsStateKey = "ConsignmentsStoredState"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
  setup: ConsignmentSetup
}

interface State extends ConsignmentSetup {
  hasLoaded?: boolean
}

export default class Info extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = props.setup || {}

    // Grab stored details from the local storage if no
    // props have been passed in
    if (!props.setup) {
      this.restoreFromLocalStorage()
    }
  }

  saveStateToLocalStorage = () => AsyncStorage.setItem(consignmentsStateKey, JSON.stringify(this.state))
  restoreFromLocalStorage = () =>
    AsyncStorage.getItem(
      consignmentsStateKey,
      (err, result) => result && this.setState({ ...JSON.parse(result), hasLoaded: true })
    )

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

  goToPhotosTapped = () =>
    this.props.navigator.push({
      component: SelectFromPhotoLibrary,
      passProps: { setup: this.state, updateWithPhotos: this.updatePhotos },
    })

  goToMetadataTapped = () =>
    this.props.navigator.push({
      component: Metadata,
      passProps: { metadata: this.state.metadata, updateWithMetadata: this.updateMetadata },
    })

  goToLocationTapped = () =>
    this.props.navigator.push({ component: Location, passProps: { updateWithResult: this.updateLocation } })

  goToFinalSubmission = () =>
    this.props.navigator.push({
      component: FinalSubmissionQuestions,
      passProps: { setup: this.state, submitFinalSubmission: this.submitFinalSubmission },
    })

  updateArtist = (result: SearchResult) => this.updateStateAndMetaphysics({ artist: result })
  updateMetadata = (result: ConsignmentMetadata) => this.updateStateAndMetaphysics({ metadata: result })
  updateProvenance = (result: string) => this.updateStateAndMetaphysics({ provenance: result })
  updateLocation = (city: string, state: string, country: string) =>
    this.updateStateAndMetaphysics({ location: { city, state, country } })

  updatePhotos = (photos: string[]) =>
    this.updateStateAndMetaphysics({ photos: photos.map(f => ({ file: f, uploaded: false })) })

  updateStateAndMetaphysics = (state: any) => this.setState(state, this.updateLocalStateAndMetaphysics)

  updateLocalStateAndMetaphysics = async () => {
    this.saveStateToLocalStorage()

    if (this.state.submission_id) {
      // This is async, but we don't need the synchronous behavior from await.
      this.uploadPhotosIfNeeded()

      updateSubmission(this.state, this.state.submission_id)
    } else if (this.state.artist) {
      const submission = await createSubmission(this.state)
      this.setState({ submission_id: submission.id })
    }
  }

  submitFinalSubmission = async (setup: ConsignmentSetup) => {
    this.setState(setup, async () => {
      await this.updateLocalStateAndMetaphysics()
      await AsyncStorage.removeItem(consignmentsStateKey)
      this.exitModal()
    })
  }

  exitModal = () => SwitchBoard.dismissModalViewController(this)

  uploadPhotosIfNeeded = async () => {
    const toUpload = this.state.photos && this.state.photos.filter(f => !f.uploaded && f.file)

    if (toUpload.length) {
      // Pull out the first in the queue and upload it
      const photo = toUpload[0]
      await uploadImageAndPassToGemini(photo.file, "private", this.state.submission_id)

      // Mutate state 'unexpectedly', then send it back through "setState" to trigger the next
      // in the queue
      photo.uploaded = true
      this.setState({ photos: this.state.photos }, this.uploadPhotosIfNeeded)
    }
  }

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
      <ConsignmentBG showCloseButton>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ paddingTop: 18 }}>
            <LargeHeadline style={{ marginLeft: 40, marginRight: 40 }}>
              {title}
            </LargeHeadline>
            <Subtitle style={{ textAlign: "center" }}>
              {subtitle}
            </Subtitle>
            <View style={{ flex: 1, flexGrow: 1, backgroundColor: "red", padding: 20 }}>
              <TODO
                goToArtist={this.goToArtistTapped}
                goToPhotos={this.goToPhotosTapped}
                goToMetadata={this.goToMetadataTapped}
                goToLocation={this.goToLocationTapped}
                goToProvenance={this.goToProvenanceTapped}
                {...this.state}
              />
            </View>
            <Row style={{ justifyContent: "center" }}>
              {this.state.hasLoaded &&
                <Button text="NEXT" onPress={canSubmit ? this.goToFinalSubmission : undefined} />}
            </Row>
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
