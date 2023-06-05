import { Spacer, Flex, Box, useTheme, Text, Separator, Join, Checkbox } from "@artsy/palette-mobile"
import { InquiryModal_artwork$data } from "__generated__/InquiryModal_artwork.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import { Input } from "app/Components/Input"
import { SubmitInquiryRequest } from "app/Scenes/Artwork/Components/Mutation/SubmitInquiryRequest"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { LocationWithDetails } from "app/utils/googleMaps"
import { Schema } from "app/utils/track"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { LayoutAnimation, ScrollView, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork$data
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
  relay: RelayProp
  onMutationSuccessful: (state: boolean) => void
}

const ErrorMessageFlex = styled(Flex)`
  position: absolute;
  top: 60px;
  width: 100%;
  z-index: 5;
`

const InquiryQuestionOption: React.FC<{
  id: string
  question: string
  setShippingModalVisibility?: (isVisible: boolean) => void
}> = ({ id, question, setShippingModalVisibility }) => {
  const { color, space } = useTheme()
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const isShipping = id === InquiryQuestionIDs.Shipping

  const questionSelected = Boolean(
    state.inquiryQuestions.find((iq) => {
      return iq.questionID === id
    })
  )

  const maybeRegisterAnimation = () => {
    if (isShipping) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 200,
      })
    }
  }

  React.useLayoutEffect(maybeRegisterAnimation, [questionSelected])

  const setSelection = () => {
    dispatch({
      type: "selectInquiryQuestion",
      payload: {
        questionID: id,
        details: isShipping ? state.shippingLocation?.name : null,
        isChecked: !questionSelected,
      },
    })
  }

  return (
    <React.Fragment>
      <TouchableOpacity onPress={setSelection}>
        <Flex
          style={{
            borderColor: questionSelected ? color("black100") : color("black10"),
            borderWidth: 1,
            borderRadius: 5,
            flexDirection: "column",
            marginTop: space(1),
            padding: space(2),
          }}
        >
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flexDirection="row">
              <Join separator={<Spacer x={4} />}>
                <Checkbox
                  testID={`checkbox-${id}`}
                  checked={questionSelected}
                  onPress={setSelection}
                />
                <Text variant="sm">{question}</Text>
              </Join>
            </Flex>
          </Flex>

          {!!isShipping && !!questionSelected && (
            <>
              <Separator my={2} />

              <TouchableOpacity
                testID="toggle-shipping-modal"
                onPress={() => {
                  if (typeof setShippingModalVisibility === "function") {
                    setShippingModalVisibility(true)
                  }
                }}
              >
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {!state.shippingLocation ? (
                    <>
                      <Text variant="sm" color="black60">
                        Add your location
                      </Text>
                      <Box>
                        <ChevronIcon color="black60" />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text variant="sm" color="black100" style={{ width: "70%" }}>
                        {state.shippingLocation.name}
                      </Text>
                      <Text variant="sm" color="blue100">
                        Edit
                      </Text>
                    </>
                  )}
                </Flex>
              </TouchableOpacity>
            </>
          )}
        </Flex>
      </TouchableOpacity>
    </React.Fragment>
  )
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork, ...props }) => {
  const { toggleVisibility, modalIsVisible, relay, onMutationSuccessful } = props
  const questions = artwork?.inquiryQuestions!
  const scrollViewRef = useRef<ScrollView>(null)
  const tracking = useTracking()
  const [addMessageYCoordinate, setAddMessageYCoordinate] = useState<number>(0)

  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const [mutationError, setMutationError] = useState(false)
  const [loading, setLoading] = useState(false)
  const selectShippingLocation = (locationDetails: LocationWithDetails) =>
    dispatch({ type: "selectShippingLocation", payload: locationDetails })
  const setMessage = useCallback(
    (message: string) => dispatch({ type: "setMessage", payload: message }),
    [dispatch]
  )
  const [mutationSuccessful, setMutationSuccessful] = useState(false)

  const AUTOMATED_MESSAGES = [
    "Hi, I’m interested in purchasing this work. Could you please provide more information about the piece?",
    "Hello, I'm interested in this artwork. Could you provide more details about it?",
    "Hi, I came across this piece and would love to learn more about it. Can you provide additional information?",
    "Hi there, I'm interested in buying this work. Could you please share some more information about it?",
    "Hello, I'm interested in this piece. Could you please provide me with more information about it?",
    "Hi, I would love to add this artwork to my collection. Could you please provide me with more details?",
    "Hi there, I'm interested in this piece. Could you please provide me with additional details?",
    "Hello, I'm interested in purchasing this artwork. Can you provide me with more information about it?",
    "Hi, I'm interested in this piece and would love to know more about it. Could you please provide additional information?",
    "Hi there, I'm interested in this piece and would like to learn more about it. Could you please provide additional details?",
    "Hello, I'm considering purchasing this artwork. Can you provide me with more information about the piece?",
    "Hi, I'm interested in this work and would love to know more about it. Could you please provide additional information?",
    "Hi there! Can you tell me more about this artwork? I'm very interested in it.",
    "Hello, this artwork caught my eye. Any chance you could provide me with more details about it?",
    "Hi, I'd love to learn more about this artwork! Could you tell me more about it?",
    "Hello! Could you give me some additional information about this artwork? I'm really interested in it.",
    "I'm very interested in this artwork. Could you please provide me with more details about it?",
    "This artwork is fascinating! Could you please share some additional information about it?",
    "Hi there! I'd like to know more about this piece. Could you tell me about it?",
    "I'm very interested in this artwork. Would you mind providing me with more information about it?",
    "I'd like to know more about this work. Could you share some additional information with me?",
    "Hello! I was intrigued by this artwork. Could you please provide me with more details about it?",
    "I'm very interested in this artwork. Can you give me more information about it?",
    "Hi there! I saw this artwork and thought it was captivating. Could you tell me more about it?",
    "I'm intrigued by this artwork. Could you please tell me more about it?",
    "Hello, I'm interested in learning more about this artwork. Could you provide me with additional details?",
    "Hi there! This artwork is stunning. Can you tell me more about it?",
    "I'm very interested in this artwork. Would you mind giving me more details about it?",
    "Hello! Could you please provide me with more details about this artwork? I'm quite interested in it.",
    "Hello, I'm interested in this work. Could you share some additional information with me about it?",
    "I'm interested in learning more about this piece. Can you tell me more about it?",
    "Hi there. I came across this artwork today. Could you please provide me with more information about it?",
    "Hello, I'm interested in this artwork and would love to know more about it.",
    "Hi, I collect art and was intrigued by this artwork. Can you provide additional information?",
    "Hello, I'm a collector and would like to inquire about this artwork. Could you please share more details?",
    "Hi, I'm very interested in this artwork and would appreciate more information about it.",
    "Hi there, I'm interested in this artwork and would like to know more about it. Can you provide further information?",
    "Hello, I'm a collector and would love to learn more about this artwork. Could you please share additional details?",
    "Hi, as someone who collects art, I was intrigued by this piece. Can you provide more information about it?",
    "Hi, I'm a collector and would like to know more about this artwork. Can you please provide additional information?",
  ]

  const getAutomatedMessages = () => {
    return AUTOMATED_MESSAGES[Math.floor(Math.random() * AUTOMATED_MESSAGES.length)]
  }

  const resetAndExit = () => {
    dispatch({ type: "resetForm", payload: null })
    setMessage(getAutomatedMessages())
    toggleVisibility()
  }

  const scrollToInput = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: addMessageYCoordinate })
  }, [addMessageYCoordinate])

  const handleErrorTracking = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Fail,
      action_name: Schema.ActionNames.InquirySend,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artwork.internalID,
      owner_slug: artwork.slug,
    })
  }

  useEffect(() => {
    setMessage(getAutomatedMessages())
  }, [setMessage])

  useEffect(() => {
    if (mutationSuccessful) {
      resetAndExit()

      tracking.trackEvent({
        action_type: Schema.ActionTypes.Success,
        action_name: Schema.ActionNames.InquirySend,
        owner_type: Schema.OwnerEntityTypes.Artwork,
        owner_id: artwork.internalID,
        owner_slug: artwork.slug,
      })

      const delayNotification = setTimeout(() => {
        onMutationSuccessful(true)
        setMutationSuccessful(false)
      }, 500)
      return () => {
        clearTimeout(delayNotification)
      }
    }
  }, [mutationSuccessful])

  useEffect(() => {
    if (mutationSuccessful || mutationError) {
      setLoading(false)
    }
  }, [mutationSuccessful, mutationError])

  const sendInquiry = () => {
    if (loading) {
      return
    }
    setLoading(true)
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.InquirySend,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artwork.internalID,
      owner_slug: artwork.slug,
    })
    SubmitInquiryRequest(
      relay.environment,
      artwork,
      state,
      setMutationSuccessful,
      setMutationError,
      handleErrorTracking
    )
  }

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => resetAndExit()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          tracking.trackEvent({
            action_type: Schema.ActionTypes.Tap,
            action_name: Schema.ActionNames.InquiryCancel,
            owner_type: Schema.OwnerEntityTypes.Artwork,
            owner_id: artwork.internalID,
            owner_slug: artwork.slug,
          })
          resetAndExit()
        }}
        rightButtonText="Send"
        rightButtonDisabled={state.inquiryQuestions.length === 0}
        onRightButtonPress={sendInquiry}
      >
        {state.inquiryType}
      </FancyModalHeader>
      {!!mutationError && (
        <ErrorMessageFlex bg="red100" py={1} alignItems="center">
          <Text variant="xs" color="white">
            Sorry, we were unable to send this message. Please try again.
          </Text>
        </ErrorMessageFlex>
      )}
      <ScrollView ref={scrollViewRef}>
        <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />
        <Box m={2}>
          <Text variant="sm">What information are you looking for?</Text>
          {
            // NOTE: For now the inquiryQuestions field values are always present and therefore never null, so it is safe to destructure them
            questions!.map((inquiryQuestion) => {
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
            })
          }
        </Box>
        <Box
          mx={2}
          mb={4}
          onLayout={({ nativeEvent }) => {
            setAddMessageYCoordinate(nativeEvent.layout.y)
          }}
        >
          <Input
            multiline
            placeholder="Add a custom note..."
            title="Add message"
            value={state.message ? state.message : ""}
            onChangeText={setMessage}
            onFocus={scrollToInput}
            style={{ justifyContent: "flex-start" }}
          />
        </Box>
      </ScrollView>
      <ShippingModal
        toggleVisibility={() => setShippingModalVisibility(!shippingModalVisibility)}
        modalIsVisible={shippingModalVisibility}
        setLocation={selectShippingLocation}
        location={state.shippingLocation}
      />
    </FancyModal>
  )
}

export const InquiryModalFragmentContainer = createFragmentContainer(InquiryModal, {
  artwork: graphql`
    fragment InquiryModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
      internalID
      slug
      inquiryQuestions {
        internalID
        question
      }
    }
  `,
})
