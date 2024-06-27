import { Box, Button, Flex, InfoCircleIcon, Separator, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { InquiryDrawer_artwork$data } from "__generated__/InquiryDrawer_artwork.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { CollapsibleArtworkDetailsFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import { InquiryQuestion } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryQuestion"
import { ShippingQuestionDrawer } from "app/Scenes/Artwork/Components/CommercialButtons/ShippingQuestionDrawer"
import { submitInquiryRequest } from "app/Scenes/Artwork/Components/Mutation/SubmitInquiryRequest"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { Schema } from "app/utils/track"
import React, { useContext, useState } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface InquiryDrawerProps {
  artwork: InquiryDrawer_artwork$data
}

/**
 * TODO:
 *
 * [x] Run this on an Android emulator
 * [x] Run this on an iPhone
 *   [x] The message field is covered by the keyboard
 *     [ ] The sticky submit button is covered by the keyboard
 *   [x] The location options are covered by the keyboard
 *   [x] After selecting a location, the drawer takes up 100% of the screen
 * [x] Add titles to the drawers
 *
 */

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({ artwork }) => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const [theInquiryIsBeingSent, setTheInquiryIsBeingSent] = useState(false)
  const [thereWasAnError, setThereWasAnError] = useState(false)
  const tracking = useTracking()

  const inquiryQuestions = artwork?.inquiryQuestions
  const partnerName = artwork?.partner?.name

  const handleModalDismiss = () => {
    trackInquiryCanceled()
    dispatch({ type: "closeInquiryDialog" })
  }

  const handleMessageChangeText = (text: string) => {
    dispatch({ type: "setMessage", payload: text })
  }

  const handleSettingsLinkPress = () => {
    navigate("my-profile/edit")
  }

  const handleSendButtonPress = () => {
    if (theInquiryIsBeingSent) {
      return
    }

    setTheInquiryIsBeingSent(true)
    trackInquiryRequested()
    submitInquiryRequest(
      getRelayEnvironment(),
      artwork,
      state,
      handleMutationSuccess,
      handleMutationError
    )
  }

  const handleMutationSuccess = () => {
    setTheInquiryIsBeingSent(false)
    trackInquirySent()

    setTimeout(() => {
      dispatch({ type: "openInquirySuccessNotification" })
    }, 500)

    dispatch({ type: "closeInquiryDialog" })
  }

  const handleMutationError = () => {
    setTheInquiryIsBeingSent(false)
    setThereWasAnError(true)
    trackInquiryFailed()
  }

  const trackInquiryCanceled = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.InquiryCancel,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artwork.internalID,
      owner_slug: artwork.slug,
    })
  }

  const trackInquiryRequested = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.InquirySend,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artwork.internalID,
      owner_slug: artwork.slug,
    })
  }

  const trackInquirySent = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Success,
      action_name: Schema.ActionNames.InquirySend,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artwork.internalID,
      owner_slug: artwork.slug,
    })
  }

  const trackInquiryFailed = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Fail,
      action_name: Schema.ActionNames.InquirySend,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artwork.internalID,
      owner_slug: artwork.slug,
    })
  }

  return (
    <>
      <AutomountedBottomSheetModal
        visible={state.isInquiryDialogOpen}
        onDismiss={handleModalDismiss}
        snapPoints={["85%"]}
      >
        <Text variant="sm-display" textAlign="center">
          Contact Gallery
        </Text>
        {!!thereWasAnError && (
          <Flex
            bg="red100"
            py={1}
            alignItems="center"
            position="absolute"
            top={6}
            zIndex={5}
            width="100%"
          >
            <Text variant="xs" color="white">
              Sorry, we were unable to send this message. Please try again.
            </Text>
          </Flex>
        )}
        <ScrollView>
          <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />
          <Box px={2}>
            <Box my={2}>
              <Text variant="sm">What information are you looking for?</Text>
              {inquiryQuestions?.map((inquiryQuestion) => {
                if (!inquiryQuestion) {
                  return false
                }
                const { internalID: id, question } = inquiryQuestion
                return (
                  <InquiryQuestion
                    key={id}
                    id={id}
                    question={question}
                    state={state}
                    dispatch={dispatch}
                  />
                )
              })}
            </Box>
            <Box>
              <BottomSheetInput
                multiline
                title="Add message"
                defaultValue={state.message}
                onChangeText={handleMessageChangeText}
                testID="message-input"
              />
            </Box>
          </Box>
        </ScrollView>
        <BottomSheetView>
          <Separator />
          <Box mt={1} flexDirection="row" px={2}>
            <InfoCircleIcon mr={0.5} style={{ marginTop: 2 }} />
            <Box flex={1}>
              <Text variant="xs" color="black60">
                By clicking send, we will share your profile with {partnerName}. Update your profile
                at any time in{" "}
                <Text variant="xs" onPress={handleSettingsLinkPress}>
                  Settings
                </Text>
                .
              </Text>
            </Box>
          </Box>
          <Box my={2} px={2}>
            <Button
              width="100%"
              block
              onPress={handleSendButtonPress}
              disabled={state.inquiryQuestions.length === 0}
              loading={theInquiryIsBeingSent}
              testID="send-button"
            >
              Send
            </Button>
          </Box>
        </BottomSheetView>
      </AutomountedBottomSheetModal>

      <ShippingQuestionDrawer />
    </>
  )
}

export const InquiryDrawerFragmentContainer = createFragmentContainer(InquiryDrawer, {
  artwork: graphql`
    fragment InquiryDrawer_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
      internalID
      slug
      inquiryQuestions {
        internalID
        question
      }
      partner {
        name
      }
    }
  `,
})
