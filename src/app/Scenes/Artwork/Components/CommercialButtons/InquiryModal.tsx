import { Box, Flex, InfoCircleIcon, Input, Text } from "@artsy/palette-mobile"
import { InquiryModal_artwork$key } from "__generated__/InquiryModal_artwork.graphql"
import { InquiryModal_me$key } from "__generated__/InquiryModal_me.graphql"
import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { InquiryQuestionOption } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryQuestionOption"
import { AUTOMATED_MESSAGES } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { useSubmitInquiryRequest } from "app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"
import { navigate } from "app/system/navigation/navigate"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { LocationWithDetails } from "app/utils/googleMaps"
import { Schema } from "app/utils/track"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork$key
  me: InquiryModal_me$key
  toggleVisibility: () => void
  modalIsVisible: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  artwork,
  me,
  toggleVisibility,
  modalIsVisible,
}) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)

  const questions = artworkData?.inquiryQuestions
  const partnerName = artworkData?.partner?.name
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

  const [commit] = useSubmitInquiryRequest()

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
      owner_id: artworkData.internalID,
      owner_slug: artworkData.slug,
    })
  }

  useEffect(() => {
    setMessage(getAutomatedMessages())
  }, [setMessage])

  useEffect(() => {
    if (mutationError) {
      setLoading(false)
    }
  }, [mutationError])

  const sendInquiry = () => {
    if (loading) {
      return
    }

    setLoading(true)

    tracking.trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.InquirySend,
      owner_type: Schema.OwnerEntityTypes.Artwork,
      owner_id: artworkData.internalID,
      owner_slug: artworkData.slug,
    })

    commit({
      variables: {
        input: {
          inquireableID: artworkData.internalID,
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
          message: state.message?.trim(),
        },
      },
      onError: () => {
        handleErrorTracking()
        setMutationError(true)
      },
      onCompleted: () => {
        setLoading(false)

        resetAndExit()

        tracking.trackEvent({
          action_type: Schema.ActionTypes.Success,
          action_name: Schema.ActionNames.InquirySend,
          owner_type: Schema.OwnerEntityTypes.Artwork,
          owner_id: artworkData.internalID,
          owner_slug: artworkData.slug,
        })

        if (userHasAnEmptyCollection() && userHasNotBeenPromptedIn30Days()) {
          dispatch({ type: "setCollectionPromptVisible", payload: true })
        } else if (userHasAnIncompleteProfile() && userHasNotBeenPromptedIn30Days()) {
          dispatch({ type: "setProfilePromptVisible", payload: true })
        } else {
          setTimeout(() => {
            dispatch({ type: "setSuccessNotificationVisible", payload: true })
          }, 500)
        }
      },
    })
  }

  const handleSettingsPress = () => {
    navigate("my-profile/edit")
    resetAndExit()
  }

  const userHasAnEmptyCollection = () => {
    return false
  }

  const userHasAnIncompleteProfile = () => {
    return !!meData.profession && !!meData.location?.city
  }

  const userHasNotBeenPromptedIn30Days = () => {
    const lastTimeUserWasPrompted = meData.collectorProfile?.lastUpdatePromptAt

    if (lastTimeUserWasPrompted == null) {
      return true
    }

    return new Date(lastTimeUserWasPrompted).getTime() > Date.now() - 30 * 24 * 60 * 60
  }

  return (
    <FancyModal
      visible={modalIsVisible}
      onBackgroundPressed={() => resetAndExit()}
      testID="inquiry-modal"
    >
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          tracking.trackEvent({
            action_type: Schema.ActionTypes.Tap,
            action_name: Schema.ActionNames.InquiryCancel,
            owner_type: Schema.OwnerEntityTypes.Artwork,
            owner_id: artworkData.internalID,
            owner_slug: artworkData.slug,
          })
          resetAndExit()
        }}
        rightButtonText="Send"
        rightButtonDisabled={state.inquiryQuestions.length === 0}
        onRightButtonPress={sendInquiry}
      >
        Contact Gallery
      </FancyModalHeader>
      {!!mutationError && (
        <ErrorMessageFlex bg="red100" py={1} alignItems="center">
          <Text variant="xs" color="white">
            Sorry, we were unable to send this message. Please try again.
          </Text>
        </ErrorMessageFlex>
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
              value={state.message ? state.message : ""}
              onChangeText={setMessage}
              onFocus={scrollToInput}
              style={{ justifyContent: "flex-start" }}
              testID="add-message-input"
            />
          </Box>
          <Box flexDirection="row">
            <InfoCircleIcon mr={0.5} style={{ marginTop: 2 }} />
            <Box flex={1}>
              <Text variant="xs" color="black60">
                By clicking send, we will share your profile with {partnerName}. Update your profile
                at any time in{" "}
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
  )
}

const ErrorMessageFlex = styled(Flex)`
  position: absolute;
  top: 60px;
  width: 100%;
  z-index: 5;
`

const artworkFragment = graphql`
  fragment InquiryModal_artwork on Artwork {
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
`

const meFragment = graphql`
  fragment InquiryModal_me on Me {
    location {
      city
    }
    profession
    collectorProfile {
      lastUpdatePromptAt
    }
  }
`
