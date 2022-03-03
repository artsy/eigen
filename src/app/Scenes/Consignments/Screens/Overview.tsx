import { Schema, screenTrack, Track, track as _track } from "app/utils/track"
import React from "react"
import { Alert } from "react-native"

import AsyncStorage from "@react-native-community/async-storage"
import type NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Dimensions, ScrollView, View } from "react-native"

import { ActionSheetOptions, connectActionSheet } from "@expo/react-native-action-sheet"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { AddEditPhotos } from "app/Components/Photos/AddEditPhotos"
import { goBack } from "app/navigation/navigate"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { Box, Button, Flex, Spacer, Text } from "palette"
import { Image as RNCImage } from "react-native-image-crop-picker"
import { ArtistResult, ConsignmentMetadata, ConsignmentSetup, Photo } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"
import { ConsignmentsSubmissionUtmParams } from "../ConsignmentsHome/ConsignmentsSubmissionForm"
import { createConsignmentSubmission } from "../Submission/createConsignmentSubmission"
import { updateConsignmentSubmission } from "../Submission/updateConsignmentSubmission"
import { uploadImageAndPassToGemini } from "../Submission/uploadPhotoToGemini"
import { ConfirmContactInfoQueryRenderer } from "./ConfirmContactInfo"
import Artist from "./ConsignmentsArtist"
import Edition from "./Edition"
import Location from "./Location"
import Metadata from "./Metadata"
import Provenance from "./Provenance"

const consignmentsStateKey = "ConsignmentsStoredState"

interface Props {
  navigator: NavigatorIOS
  params: ConsignmentsSubmissionUtmParams
  setup: ConsignmentSetup
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void
}

interface State extends ConsignmentSetup {
  hasLoaded?: boolean
  /** Used at the end to keep track of the final submission to convection for the Confirmation page to see */
  hasSubmittedSuccessfully?: boolean
}

const track: Track<Props, State> = _track

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsOverView,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export class Overview extends React.Component<Props, State> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)
    this.state = props.setup || {}

    // Grab stored details from the local storage if no
    // props have been passed in

    if (!props.setup) {
      this.restoreFromLocalStorage()
    }
  }

  saveStateToLocalStorage = () =>
    AsyncStorage.setItem(consignmentsStateKey, JSON.stringify(this.state))
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

  photosUpdated = (updatedPhotos: Photo[]) => {
    const updatedImages = updatedPhotos.map((p) => p.image)
    this.updatePhotos(updatedImages)
  }

  goToPhotosTapped = () => {
    if (this.state.photos && this.state.photos.length > 0) {
      this.props.navigator.push({
        component: AddEditPhotos,
        passProps: { initialPhotos: this.state.photos, photosUpdated: this.photosUpdated },
      })
    } else {
      showPhotoActionSheet(this.props.showActionSheetWithOptions!).then((images) => {
        this.updatePhotos(images)
      })
    }
  }

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
    this.props.navigator.push({
      component: Location,
      passProps: { updateWithResult: this.updateLocation },
    })

  updateArtist = (result: ArtistResult) => this.updateStateAndMetaphysics({ artist: result })
  updateMetadata = (result: ConsignmentMetadata) =>
    this.updateStateAndMetaphysics({ metadata: result })
  updateProvenance = (result: string) => this.updateStateAndMetaphysics({ provenance: result })
  updateEdition = (result: ConsignmentSetup) => this.updateStateAndMetaphysics(result)
  updateLocation = (city: string, state: string, country: string) =>
    this.updateStateAndMetaphysics({ location: { city, state, country } })

  updatePhotos = (photos: RNCImage[]) => {
    this.updateStateAndMetaphysics({ photos: photos.map((p) => ({ image: p, uploaded: false })) })
  }

  updateStateAndMetaphysics = (state: Partial<ConsignmentSetup>) =>
    this.setState(state, this.updateLocalStateAndMetaphysics)

  updateLocalStateAndMetaphysics = async () => {
    this.saveStateToLocalStorage()

    try {
      if (this.state.submissionID) {
        await this.uploadPhotosIfNeeded()
        const utmSource = this.props.params.utm_source
        const utmMedium = this.props.params.utm_medium
        const utmTerm = this.props.params.utm_term
        updateConsignmentSubmission({ ...this.state, utmSource, utmTerm, utmMedium })
      } else if (this.state.artist) {
        const submissionID = await createConsignmentSubmission(this.state)
        this.setState({ submissionID }, () => {
          this.submissionDraftCreated()
          this.updateLocalStateAndMetaphysics()
        })
      }
    } catch (error: any) {
      this.showUploadFailureAlert(error)
    }
  }

  showUploadFailureAlert(error: Error) {
    Alert.alert(
      "Sorry, we couldn't upload your images.",
      "Please try again or contact consign@artsy.net for help.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            this.setState({ photos: this.state.photos?.filter((photo) => photo.uploaded) })
          },
        },
        {
          text: "Retry",
          onPress: () => {
            this.updateLocalStateAndMetaphysics()
          },
        },
      ]
    )
    console.log("src/Screens/Consignments/Screens/Overview.tsx", error)
  }

  @track((_props, state) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConsignmentDraftCreated,
    owner_id: state.submissionID,
    owner_type: Schema.OwnerEntityTypes.Consignment,
    owner_slug: state.submissionID,
  }))
  submissionDraftCreated() {
    return null
  }

  submitFinalSubmission = async () => {
    this.showConfirmationScreen()

    const submission = this.state as ConsignmentSetup
    let hasSubmittedSuccessfully = true
    try {
      const utmSource = this.props.params.utm_source
      const utmMedium = this.props.params.utm_medium
      const utmTerm = this.props.params.utm_term
      await updateConsignmentSubmission({
        ...submission,
        utmSource,
        utmTerm,
        utmMedium,
        state: "SUBMITTED",
      })
      await AsyncStorage.removeItem(consignmentsStateKey)
      this.submissionDraftSubmitted()
    } catch (error) {
      console.error("Overview final submission: " + error)
      hasSubmittedSuccessfully = false
    }

    this.setState({ hasSubmittedSuccessfully })
  }

  @track((_props, state) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConsignmentSubmitted,
    owner_id: state.submissionID,
    owner_type: Schema.OwnerEntityTypes.Consignment,
    owner_slug: state.submissionID,
  }))
  submissionDraftSubmitted() {
    return null
  }

  showConfirmationScreen() {
    // Confirmation will ask to see how the submission process has worked in 1 second
    const submissionRequestValidationCheck = () => this.state.hasSubmittedSuccessfully
    // Show confirmation screen
    this.props.navigator.push({
      component: ConfirmContactInfoQueryRenderer,
      passProps: { submissionRequestValidationCheck },
    })
  }

  uploadPhotosIfNeeded = async () => {
    const uploading = this.state.photos && this.state.photos.some((f) => f.uploading)
    const toUpload =
      this.state.photos && this.state.photos.filter((f) => !f.uploaded && f.image.path)
    if (!uploading && toUpload && toUpload.length) {
      // Pull out the first in the queue and upload it
      const photo = toUpload[0]
      try {
        // Set this one photo to upload, so that if you go in and out
        // quickly it doesn't upload duplicates
        photo.uploading = true
        this.setState({ photos: this.state.photos })
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        await uploadImageAndPassToGemini(photo.image.path, "private", this.state.submissionID)

        // Mutate state 'unexpectedly', then send it back through "setState" to trigger the next
        // in the queue
        photo.uploaded = true
        photo.uploading = false
        this.setState({ photos: this.state.photos }, this.uploadPhotosIfNeeded)
      } catch (e) {
        // Reset photos to enable upload retry, propogate exception upward
        photo.uploaded = false
        photo.uploading = false
        throw e
      }
    }
  }

  canSubmit = () =>
    !!(
      this.state.artist &&
      this.state.location &&
      this.state.metadata &&
      this.state.metadata.category &&
      this.state.metadata.title &&
      this.state.metadata.year &&
      this.state.metadata.medium &&
      this.state.metadata.height &&
      this.state.metadata.width &&
      this.state.editionScreenViewed &&
      this.state.photos?.filter((photo) => photo.uploaded).length! > 0 &&
      !this.isPhotoLoading()
    )

  isPhotoLoading = () => this.state.photos?.some((photo) => photo.uploading)

  render() {
    // See https://github.com/artsy/convection/blob/master/app/models/submission.rb for list
    const canSubmit = this.canSubmit()
    const isPhotoLoading = this.isPhotoLoading()

    const isPad = Dimensions.get("window").width > 700

    return (
      <>
        <FancyModalHeader
          useXButton
          onLeftButtonPress={() => {
            goBack()
          }}
        >
          Submit a work
        </FancyModalHeader>
        <ScrollView
          style={{ flex: 1 }}
          alwaysBounceVertical={false}
          contentContainerStyle={{ paddingVertical: 20, justifyContent: "center" }}
        >
          <View
            style={{
              alignSelf: "center",
              width: "100%",
              maxWidth: 540,
            }}
          >
            <Box px={2}>
              <Text variant="sm" style={{ textAlign: isPad ? "center" : "left" }}>
                Step 1 of 2
              </Text>
              <Spacer mb={1} />
              <Text variant="lg" style={{ textAlign: isPad ? "center" : "left" }}>
                Add details for your work
              </Text>
              <Spacer mb={1} />
              <Text
                variant="sm"
                color="black60"
                style={{ textAlign: isPad ? "center" : "left", marginBottom: isPad ? 80 : 0 }}
              >
                Provide as much detail as possible so that our partners can best assess your work.
              </Text>
            </Box>
            <TODO
              goToArtist={this.goToArtistTapped}
              goToPhotos={this.goToPhotosTapped}
              goToEdition={this.goToEditionTapped}
              goToMetadata={this.goToMetadataTapped}
              goToLocation={this.goToLocationTapped}
              goToProvenance={this.goToProvenanceTapped}
              {...this.state}
            />
            <Spacer mb={isPad ? 80 : 2} />
          </View>
          <Flex px="2" width="100%" alignItems="center">
            <Button
              maxWidth={540}
              block
              loading={isPhotoLoading}
              onPress={this.state.hasLoaded && canSubmit ? this.submitFinalSubmission : undefined}
              disabled={!canSubmit}
              haptic
              testID="consignments-next-button"
            >
              Next
            </Button>
          </Flex>
        </ScrollView>
      </>
    )
  }
}

export const ConnectedOverview = connectActionSheet<Props & State>(Overview)
