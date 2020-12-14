import { InquiryModal_artwork } from "__generated__/InquiryModal_artwork.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { TextArea } from "lib/Components/TextArea"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { ArtworkInquiryContext } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { LocationWithDetails } from "lib/utils/googleMaps"
import { Box, color, Flex, Separator, space, Text } from "palette"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { LayoutAnimation, ScrollView, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { SubmitInquiryRequest } from "../Mutation/SubmitInquiryRequest"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork
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
              <Checkbox data-test-id={`checkbox-${id}`} checked={questionSelected} onPress={setSelection} />
              <Text variant="text">{question}</Text>
            </Flex>
          </Flex>

          {!!isShipping && !!questionSelected && (
            <>
              <Separator my={2} />

              <TouchableOpacity
                data-test-id="toggle-shipping-modal"
                onPress={() => {
                  if (typeof setShippingModalVisibility === "function") {
                    setShippingModalVisibility(true)
                  }
                }}
              >
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {!state.shippingLocation ? (
                    <>
                      <Text variant="text" color="black60">
                        Add your location
                      </Text>
                      <Box>
                        <ChevronIcon color="black60" />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text variant="text" color="black100" style={{ width: "70%" }}>
                        {state.shippingLocation.name}
                      </Text>
                      <Text variant="text" color="purple100">
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

  const [addMessageYCoordinate, setAddMessageYCoordinate] = useState<number>(0)

  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const [errorMessageVisibility, setErrorMessageVisibility] = useState(false)
  const selectShippingLocation = (locationDetails: LocationWithDetails) =>
    dispatch({ type: "selectShippingLocation", payload: locationDetails })
  const setMessage = (message: string) => dispatch({ type: "setMessage", payload: message })
  const [mutationSuccessful, setMutationSuccessful] = useState(false)
  const resetAndExit = () => {
    dispatch({ type: "resetForm", payload: null })
    toggleVisibility()
  }

  const scrollToInput = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: addMessageYCoordinate })
  }, [addMessageYCoordinate])

  useEffect(() => {
    if (mutationSuccessful) {
      resetAndExit()

      const delayNotification = setTimeout(() => {
        onMutationSuccessful(true)
        setMutationSuccessful(false)
      }, 500)
      return () => {
        clearTimeout(delayNotification)
      }
    }
  }, [mutationSuccessful])

  return (
    <FancyModal visible={modalIsVisible} onDismiss={() => resetAndExit()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          resetAndExit()
        }}
        rightButtonText="Send"
        rightButtonDisabled={state.inquiryQuestions.length === 0 && !state.message}
        onRightButtonPress={() => {
          SubmitInquiryRequest(relay.environment, artwork, state, setMutationSuccessful, setErrorMessageVisibility)
        }}
      >
        {state.inquiryType}
      </FancyModalHeader>
      {!!errorMessageVisibility && (
        <ErrorMessageFlex bg="red100" py={1} alignItems="center">
          <Text variant="small" color="white">
            Sorry, we were unable to send this message. Please try again.
          </Text>
        </ErrorMessageFlex>
      )}
      <ScrollView ref={scrollViewRef}>
        <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />
        <Box m={2}>
          <Text variant="mediumText">What information are you looking for?</Text>
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
          <TextArea
            placeholder="Add a custom note..."
            title="Add message"
            value={state.message ? state.message : ""}
            onChangeText={setMessage}
            onFocus={scrollToInput}
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
      inquiryQuestions {
        internalID
        question
      }
    }
  `,
})
