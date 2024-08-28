import { Box, Flex, InfoCircleIcon, Input, Text } from "@artsy/palette-mobile"
import { InquiryModal_artwork$key } from "__generated__/InquiryModal_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { CompleteProfilePrompt } from "app/Scenes/Artwork/Components/CommercialButtons/CompleteProfilePrompt"
import { InquiryQuestionOption } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryQuestionOption"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { randomAutomatedMessage } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { useSendInquiry } from "app/Scenes/Artwork/hooks/useSendInquiry"
import { MyCollectionBottomSheetModalArtistsPrompt } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { navigate } from "app/system/navigation/navigate"
import { useArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { LocationWithDetails } from "app/utils/googleMaps"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useUpdateCollectorProfile } from "app/utils/mutations/useUpdateCollectorProfile"
import { Schema } from "app/utils/track"
import React, { useCallback, useRef, useState } from "react"
import { ScrollView } from "react-native"
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
  const profilePromptIsEnabled = useFeatureFlag("AREnableCollectorProfilePrompts")
  const scrollViewRef = useRef<ScrollView>(null)
  const tracking = useTracking()
  const [commit] = useUpdateCollectorProfile()

  const artwork = useFragment(artworkFragment, _artwork)

  const [message, setMessage] = useState<string>(() => randomAutomatedMessage())
  const [addMessageYCoordinate, setAddMessageYCoordinate] = useState<number>(0)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)

  const resetAndExit = () => {
    setMessage(randomAutomatedMessage())
    dispatch({ type: "resetForm", payload: null })
    dispatch({ type: "setInquiryModalVisible", payload: false })
  }

  const { sendInquiry, error } = useSendInquiry({
    onCompleted: resetAndExit,
    artwork,
    me,
  })

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
    resetAndExit()
  }

  const handleDismiss = () => {
    tracking.trackEvent(tracks.dismissedTheModal(artwork.internalID, artwork.slug))
    resetAndExit()
  }

  const handleProfilePromptDismiss = () => {
    dispatch({ type: "setProfilePromptVisible", payload: false })
  }

  const handleCollectionPromptDismiss = () => {
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
    dispatch({ type: "setCollectionPromptVisible", payload: false })
  }

  return (
    <>
      <FancyModal visible={state.inquiryModalVisible} onBackgroundPressed={handleDismiss}>
        <FancyModalHeader
          leftButtonText="Cancel"
          onLeftButtonPress={handleDismiss}
          rightButtonText="Send"
          rightButtonDisabled={state.inquiryQuestions.length === 0}
          onRightButtonPress={() => sendInquiry(message)}
        >
          Contact Gallery
        </FancyModalHeader>
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
            <Text variant="xs" color="white">
              Sorry, we were unable to send this message. Please try again.
            </Text>
          </Flex>
        )}
        <ScrollView ref={scrollViewRef}>
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
                <Text variant="xs" color="black60">
                  By clicking send, we will share your profile with {artwork.partner?.name}. Update
                  your profile at any time in{" "}
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
      </FancyModal>
      <InquirySuccessNotification />

      {!!profilePromptIsEnabled && (
        <CompleteProfilePrompt
          artwork={artwork}
          me={me}
          visible={state.profilePromptVisible}
          onDismiss={handleProfilePromptDismiss}
        />
      )}
      {!!profilePromptIsEnabled && (
        <MyCollectionBottomSheetModalArtistsPrompt
          visible={state.collectionPromptVisible}
          title="Inquiry sent! Tell us about the artists in your collection."
          onDismiss={handleCollectionPromptDismiss}
        />
      )}
    </>
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
    partner {
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
