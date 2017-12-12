import { Schema, screenTrack, Track, track as _track } from "lib/utils/track"
import React from "react"
import { AsyncStorage, Dimensions, NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"

import { ConsignmentMetadata, ConsignmentSetup, SearchResult } from "../"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import TODO from "../Components/ArtworkConsignmentTodo"
import CloseButton from "../Components/CloseButton"
import ConsignmentBG from "../Components/ConsignmentBG"
import { Button, Row } from "../Components/FormElements"
import createSubmission from "../Submission/create"
import updateSubmission from "../Submission/update"
import { uploadImageAndPassToGemini } from "../Submission/uploadPhotoToGemini"
import { LargeHeadline, Subtitle } from "../Typography"
import Artist from "./Artist"
import Edition from "./Edition"
import FinalSubmissionQuestions from "./FinalSubmissionQuestions"
import Location from "./Location"
import Metadata from "./Metadata"
import Provenance from "./Provenance"
import SelectFromPhotoLibrary from "./SelectFromPhotoLibrary"

const consignmentsStateKey = "ConsignmentsStoredState"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
  setup: ConsignmentSetup
}

interface State extends ConsignmentSetup {
  hasLoaded?: boolean
}

const track: Track<Props, State> = _track

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsOverView,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
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
    AsyncStorage.getItem(consignmentsStateKey, (_err, result) => {
      const results = (result && JSON.parse(result)) || {}
      this.setState({ ...results, hasLoaded: true })
    })

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

  goToEditionTapped = () =>
    this.props.navigator.push({
      component: Edition,
      passProps: { setup: this.state, updateWithEdition: this.updateEdition },
    })

  goToLocationTapped = () =>
    this.props.navigator.push({ component: Location, passProps: { updateWithResult: this.updateLocation } })

  goToFinalSubmission = () => this.submitFinalSubmission(this.state)

  updateArtist = (result: SearchResult) => this.updateStateAndMetaphysics({ artist: result })
  updateMetadata = (result: ConsignmentMetadata) => this.updateStateAndMetaphysics({ metadata: result })
  updateProvenance = (result: string) => this.updateStateAndMetaphysics({ provenance: result })
  updateEdition = (result: ConsignmentSetup) => this.updateStateAndMetaphysics(result)
  updateLocation = (city: string, state: string, country: string) =>
    this.updateStateAndMetaphysics({ location: { city, state, country } })

  updatePhotos = (photos: string[]) =>
    photos.length && this.updateStateAndMetaphysics({ photos: photos.map(f => ({ file: f, uploaded: false })) })

  updateStateAndMetaphysics = (state: Partial<ConsignmentSetup>) =>
    this.setState(state, this.updateLocalStateAndMetaphysics)

  updateLocalStateAndMetaphysics = async () => {
    this.saveStateToLocalStorage()

    if (this.state.submission_id) {
      // This is async, but we don't need the synchronous behavior from await.
      this.uploadPhotosIfNeeded()

      updateSubmission(this.state, this.state.submission_id)
    } else if (this.state.artist) {
      const submission = await createSubmission(this.state)
      this.setState({ submission_id: submission.id }, () => {
        this.submissionDraftCreated()
      })
    }
  }

  @track((_props, state) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConsignmentDraftCreated,
    owner_id: state.submission_id,
    owner_type: Schema.OwnerEntityTypes.Consignment,
    owner_slug: state.submission_id,
  }))
  submissionDraftCreated() {
    return null
  }

  submitFinalSubmission = async (setup: ConsignmentSetup) => {
    this.setState(setup, async () => {
      await this.updateLocalStateAndMetaphysics()
      await AsyncStorage.removeItem(consignmentsStateKey)
      this.submissionDraftSubmitted()
      this.exitModal()
    })
  }

  @track((_props, state) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConsignmentSubmitted,
    owner_id: state.submission_id,
    owner_type: Schema.OwnerEntityTypes.Consignment,
    owner_slug: state.submission_id,
  }))
  submissionDraftSubmitted() {
    return null
  }

  exitModal = () => SwitchBoard.dismissModalViewController(this)

  uploadPhotosIfNeeded = async () => {
    const toUpload = this.state.photos && this.state.photos.filter(f => !f.uploaded && f.file)

    if (toUpload && toUpload.length) {
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

    const isPad = Dimensions.get("window").width > 700

    return (
      <ConsignmentBG>
        <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false} centerContent>
          <View
            style={{
              paddingTop: 10,
              alignSelf: "center",
              width: "100%",
              maxWidth: 540,
              flex: 1,
            }}
          >
            <LargeHeadline style={{ textAlign: isPad ? "center" : "left" }}>
              {title}
            </LargeHeadline>
            <Subtitle style={{ textAlign: isPad ? "center" : "left", marginBottom: isPad ? 80 : 0, marginTop: -15 }}>
              {subtitle}
            </Subtitle>
            <View style={{ flex: 1 }}>
              <TODO
                goToArtist={this.goToArtistTapped}
                goToPhotos={this.goToPhotosTapped}
                goToEdition={this.goToEditionTapped}
                goToMetadata={this.goToMetadataTapped}
                goToLocation={this.goToLocationTapped}
                goToProvenance={this.goToProvenanceTapped}
                {...this.state}
              />
            </View>
            <Row style={{ justifyContent: "center", marginTop: isPad ? 80 : -30 }}>
              {this.state.hasLoaded &&
                <Button text="SUBMIT" onPress={canSubmit ? this.goToFinalSubmission : undefined} />}
            </Row>
            <Row style={{ justifyContent: "center", marginTop: isPad ? 0 : -20 }}>
              <CloseButton />
            </Row>
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
