import { Box, Flex, InfoCircleIcon, Input, Screen, Text } from "@artsy/palette-mobile"
import { InquiryModal_artwork$key } from "__generated__/InquiryModal_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { CompleteProfilePrompt } from "app/Scenes/Artwork/Components/CommercialButtons/CompleteProfilePrompt"
import { InquiryQuestionOption } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryQuestionOption"
import { randomAutomatedMessage } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { useSendInquiry } from "app/Scenes/Artwork/hooks/useSendInquiry"
import { MyCollectionBottomSheetModalArtistsPrompt } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { navigate } from "app/system/navigation/navigate"
import { useArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { LocationWithDetails } from "app/utils/googleMaps"
import { useUpdateCollectorProfile } from "app/utils/mutations/useUpdateCollectorProfile"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { KeyboardAvoidingView, Modal, Platform, ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork: _artwork, me }) => {
  const { state, dispatch } = useArtworkInquiryContext()
  const scrollViewRef = useRef<ScrollView>(null)
  const tracking = useTracking()
  const [commit] = useUpdateCollectorProfile()

  const artwork = useFragment(artworkFragment, _artwork)

  const [message, setMessage] = useState<string>(() => randomAutomatedMessage())
  const [addMessageYCoordinate, setAddMessageYCoordinate] = useState<number>(0)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)

  const exit = () => {
    dispatch({ type: "setInquiryModalVisible", payload: false })
  }

  const { sendInquiry, error } = useSendInquiry({
    onCompleted: exit,
    artwork,
    me,
  })

  useEffect(() => {
    if (state.inquiryModalVisible) {
      return
    }

    setTimeout(() => setMessage(randomAutomatedMessage()), 500)
    if (state.shippingLocation || state.inquiryQuestions.length) {
      dispatch({ type: "resetForm", payload: null })
    }
  }, [state.inquiryQuestions.length, state.shippingLocation, state.inquiryModalVisible])

  const scrollToInput = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: addMessageYCoordinate })
  }, [addMessageYCoordinate])

  if (!artwork) {
    return null
  }

  const selectShippingLocation = (locationDetails: LocationWithDetails) =>
    dispatch({ type: "selectShippingLocation", payload: locationDetails })

  const handleSettingsPress = () => {
    navigate("my-profile/edit")
    exit()
  }

  const handleDismiss = () => {
    tracking.trackEvent(tracks.dismissedTheModal(artwork.internalID, artwork.slug))
    exit()
  }

  const handleProfilePromptDismiss = () => {
    dispatch({ type: "setProfilePromptVisible", payload: false })
  }

  const handleCollectionPromptDismiss = () => {
    dispatch({ type: "setCollectionPromptVisible", payload: false })
    commit({
      variables: { input: { promptedForUpdate: true } },
      onCompleted: (res, e) => {
        const error =
          res.updateCollectorProfile?.collectorProfileOrError?.mutationError?.message ?? e
        if (error) {
          console.error(
            "[InquiryModal MyCollectionArtistsPromptFooter updateCollectorProfile] error:",
            error
          )
        }
      },
      onError: (error) => {
        console.error(
          "[InquiryModal MyCollectionArtistsPromptFooter updateCollectorProfile] error:",
          error
        )
      },
    })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Modal
        visible={state.inquiryModalVisible}
        onDismiss={handleDismiss}
        statusBarTranslucent
        animationType="slide"
      >
        <Screen>
          <NavigationHeader
            leftButtonText="Cancel"
            onLeftButtonPress={handleDismiss}
            rightButtonText="Send"
            rightButtonDisabled={state.inquiryQuestions.length === 0 && message === ""}
            onRightButtonPress={() => sendInquiry(message)}
          >
            Contact Gallery
          </NavigationHeader>
          {!!error && (
            <Flex
              bg="red100"
              py={1}
              alignItems="center"
              position="absolute"
              top={6}
              width={1}
              zIndex={5}
            >
              <Text variant="xs" color="mono0">
                Sorry, we were unable to send this message. Please try again.
              </Text>
            </Flex>
          )}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
          >
            <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />
            <Box px={2}>
              <Box my={2}>
                <Text variant="sm">What information are you looking for?</Text>
                {artwork.inquiryQuestions?.map((inquiryQuestion) => {
                  if (!inquiryQuestion) {
                    return false
                  }
                  const { internalID: id, question } = inquiryQuestion
                  return id === InquiryQuestionIDs.Shipping ? (
                    <InquiryQuestionOption
                      key={id}
                      id={id}
                      question={question}
                      setShippingModalVisibility={setShippingModalVisibility}
                    />
                  ) : (
                    <InquiryQuestionOption key={id} id={id} question={question} />
                  )
                })}
              </Box>
              <Box
                mb={4}
                onLayout={({ nativeEvent }) => {
                  setAddMessageYCoordinate(nativeEvent.layout.y)
                }}
              >
                <Input
                  multiline
                  placeholder="Add a custom note..."
                  title="Add message"
                  accessibilityLabel="Add message"
                  value={message ? message : ""}
                  onChangeText={setMessage}
                  onFocus={scrollToInput}
                  style={{ justifyContent: "flex-start" }}
                />
              </Box>
              <Box flexDirection="row">
                <InfoCircleIcon mr={0.5} style={{ marginTop: 2 }} />
                <Box flex={1}>
                  <Text variant="xs" color="mono60">
                    By clicking send, we will share your profile with {artwork.partner?.name}.
                    Update your profile at any time in{" "}
                    <Text variant="xs" onPress={handleSettingsPress}>
                      Settings
                    </Text>
                    .
                  </Text>
                </Box>
              </Box>
            </Box>
          </ScrollView>
          <ShippingModal
            toggleVisibility={() => setShippingModalVisibility(!shippingModalVisibility)}
            modalIsVisible={shippingModalVisibility}
            setLocation={selectShippingLocation}
            location={state.shippingLocation}
          />
        </Screen>
      </Modal>

      <CompleteProfilePrompt
        artwork={artwork}
        me={me}
        visible={state.profilePromptVisible}
        onDismiss={handleProfilePromptDismiss}
      />
      <MyCollectionBottomSheetModalArtistsPrompt
        visible={state.collectionPromptVisible}
        title="Inquiry sent! Tell us about the artists in your collection."
        onDismiss={handleCollectionPromptDismiss}
      />
    </KeyboardAvoidingView>
  )
}

const artworkFragment = graphql`
  fragment InquiryModal_artwork on Artwork {
    ...CollapsibleArtworkDetails_artwork
    ...CompleteProfilePrompt_artwork
    ...useSendInquiry_artwork

    internalID @required(action: NONE)
    slug @required(action: NONE)
    inquiryQuestions {
      internalID
      question
    }
    partner(shallow: true) {
      name
    }
  }
`

const tracks = {
  dismissedTheModal: (artworkId: string, artworkSlug: string) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquiryCancel,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
}
