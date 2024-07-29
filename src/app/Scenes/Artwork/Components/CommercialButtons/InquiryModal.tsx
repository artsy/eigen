import { Box, Flex, InfoCircleIcon, Input, Text } from "@artsy/palette-mobile"
import { InquiryModal_artwork$key } from "__generated__/InquiryModal_artwork.graphql"
import { InquiryModal_me$key } from "__generated__/InquiryModal_me.graphql"
import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { CompleteProfilePrompt } from "app/Scenes/Artwork/Components/CommercialButtons/CompleteProfilePrompt"
import { InquiryQuestionOption } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryQuestionOption"
import { InquirySuccessNotification } from "app/Scenes/Artwork/Components/CommercialButtons/InquirySuccessNotification"
import { randomAutomatedMessage } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { useSubmitInquiryRequest } from "app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"
import { navigate } from "app/system/navigation/navigate"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import {
  userShouldBePromptedToAddArtistsToCollection,
  userShouldBePromptedToCompleteProfile,
} from "app/utils/collectorPromptHelpers"
import { LocationWithDetails } from "app/utils/googleMaps"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork$key
  me: InquiryModal_me$key
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork, me }) => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const profilePromptIsEnabled = useFeatureFlag("AREnableCollectorProfilePrompts")
  const scrollViewRef = useRef<ScrollView>(null)
  const [commit] = useSubmitInquiryRequest()
  const tracking = useTracking()

  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)

  const [message, setMessage] = useState<string>("")
  const [addMessageYCoordinate, setAddMessageYCoordinate] = useState<number>(0)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const [mutationError, setMutationError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMessage(randomAutomatedMessage())
  }, [setMessage])

  useEffect(() => {
    if (mutationError) {
      setLoading(false)
    }
  }, [mutationError])

  const artworkId = artworkData.internalID
  const artworkSlug = artworkData.slug
  const questions = artworkData?.inquiryQuestions
  const partnerName = artworkData?.partner?.name

  const selectShippingLocation = (locationDetails: LocationWithDetails) =>
    dispatch({ type: "selectShippingLocation", payload: locationDetails })

  const resetAndExit = () => {
    setMessage(randomAutomatedMessage())
    dispatch({ type: "resetForm", payload: null })
    dispatch({ type: "setInquiryModalVisible", payload: false })
  }

  const scrollToInput = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: addMessageYCoordinate })
  }, [addMessageYCoordinate])

  const sendInquiry = () => {
    if (loading) {
      return
    }

    setLoading(true)

    tracking.trackEvent(tracks.attemptedToSendTheInquiry(artworkId, artworkSlug))

    commit({
      variables: {
        input: {
          inquireableID: artworkId,
          inquireableType: "Artwork",
          questions: state.inquiryQuestions.map((q: InquiryQuestionInput) => {
            /**
             * If the user selected the shipping question and has a location, add the location
             * details that are stored in the state.
             */
            if (q.questionID === "shipping_quote" && state.shippingLocation) {
              const details = JSON.stringify({
                city: state.shippingLocation.city,
                coordinates: state.shippingLocation.coordinates,
                country: state.shippingLocation.country,
                postal_code: state.shippingLocation.postalCode,
                state: state.shippingLocation.state,
                state_code: state.shippingLocation.stateCode,
              })
              return { ...q, details }
            } else {
              return q
            }
          }),
          message: message?.trim(),
        },
      },
      onError: () => {
        tracking.trackEvent(tracks.failedToSendTheInquiry(artworkId, artworkSlug))

        setMutationError(true)
      },
      onCompleted: () => {
        setLoading(false)
        resetAndExit()
        tracking.trackEvent(tracks.successfullySentTheInquiry(artworkId, artworkSlug))

        const lastPromptAt = meData.collectorProfile?.lastUpdatePromptAt

        if (
          profilePromptIsEnabled &&
          userShouldBePromptedToAddArtistsToCollection({ lastPromptAt })
        ) {
          dispatch({ type: "setCollectionPromptVisible", payload: true })
          return
        }

        const city = meData.location?.city
        const profession = meData.profession

        if (
          profilePromptIsEnabled &&
          userShouldBePromptedToCompleteProfile({ city, profession, lastPromptAt })
        ) {
          dispatch({ type: "setProfilePromptVisible", payload: true })
          return
        }

        setTimeout(() => {
          dispatch({ type: "setSuccessNotificationVisible", payload: true })
        }, 500)
      },
    })
  }

  const handleSettingsPress = () => {
    navigate("my-profile/edit")
    resetAndExit()
  }

  const handleDismiss = () => {
    tracking.trackEvent(tracks.dismissedTheModal(artworkId, artworkSlug))
    resetAndExit()
  }

  return (
    <>
      <FancyModal visible={state.inquiryModalVisible} onBackgroundPressed={handleDismiss}>
        <FancyModalHeader
          leftButtonText="Cancel"
          onLeftButtonPress={handleDismiss}
          rightButtonText="Send"
          rightButtonDisabled={state.inquiryQuestions.length === 0}
          onRightButtonPress={sendInquiry}
        >
          Contact Gallery
        </FancyModalHeader>
        {!!mutationError && (
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
          <CollapsibleArtworkDetailsFragmentContainer artwork={artworkData} />
          <Box px={2}>
            <Box my={2}>
              <Text variant="sm">What information are you looking for?</Text>
              {questions?.map((inquiryQuestion) => {
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
                  By clicking send, we will share your profile with {partnerName}. Update your
                  profile at any time in{" "}
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
      {!!profilePromptIsEnabled && <CompleteProfilePrompt artwork={artworkData} me={meData} />}
    </>
  )
}

const artworkFragment = graphql`
  fragment InquiryModal_artwork on Artwork {
    ...CollapsibleArtworkDetails_artwork
    ...CompleteProfilePrompt_artwork
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
`

const meFragment = graphql`
  fragment InquiryModal_me on Me {
    ...MyProfileEditModal_me
    location {
      city
    }
    profession
    collectorProfile {
      lastUpdatePromptAt
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
  attemptedToSendTheInquiry: (artworkId: string, artworkSlug: string) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
  successfullySentTheInquiry: (artworkId: string, artworkSlug: string) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
  failedToSendTheInquiry: (artworkId: string, artworkSlug: string) => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
}
