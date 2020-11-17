import { InquiryModal_artwork } from "__generated__/InquiryModal_artwork.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { ArtworkInquiryContext } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { LocationDetails } from "lib/utils/googleMaps"
import { Box, color, Flex, Separator, space, Text } from "palette"
import React, { useContext, useState } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"
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

  return (
    <React.Fragment>
      <InquiryField>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="row">
            <Checkbox
              data-test-id={`checkbox-${id}`}
              checked={questionSelected}
              onPress={() => {
                dispatch({
                  type: "selectInquiryQuestion",
                  payload: {
                    questionID: id,
                    details: isShipping ? state.shippingLocation?.name : null,
                    isChecked: !questionSelected,
                  },
                })
              }}
            />
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
                    <Box mt={0.5}>
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
      </InquiryField>
    </React.Fragment>
  )
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork, ...props }) => {
  const { toggleVisibility, modalIsVisible, relay } = props
  const questions = artwork?.inquiryQuestions!
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const [errorMessageVisibility, setErrorMessageVisibility] = useState(false)
  const selectShippingLocation = (locationDetails: LocationDetails) =>
    dispatch({ type: "selectShippingLocation", payload: locationDetails })

  const resetAndExit = () => {
    dispatch({ type: "resetForm", payload: null })
    toggleVisibility()
  }
  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => resetAndExit()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          resetAndExit()
        }}
        rightButtonText="Send"
        rightButtonDisabled={state.inquiryQuestions.length === 0}
        onRightButtonPress={() => {
          SubmitInquiryRequest(relay.environment, artwork, state, setErrorMessageVisibility)
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
      <ShippingModal
        toggleVisibility={() => setShippingModalVisibility(!shippingModalVisibility)}
        modalIsVisible={shippingModalVisibility}
        setLocation={selectShippingLocation}
        location={state.shippingLocation}
      />
    </FancyModal>
  )
}

const InquiryField = styled(Flex)`
  border-radius: 5;
  border: solid 1px ${color("black10")};
  flex-direction: column;
  margin-top: ${space(1)}px;
  padding: ${space(2)}px;
`

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
