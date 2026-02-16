import { OwnerType } from "@artsy/cohesion"
import { InfoIcon } from "@artsy/icons/native"
import {
  Box,
  Button,
  Flex,
  Input,
  InputRef,
  Screen,
  Text,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { InquiryModal_artwork$key } from "__generated__/InquiryModal_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { CompleteProfilePrompt } from "app/Scenes/Artwork/Components/CommercialButtons/CompleteProfilePrompt"
import { InquiryQuestionOption } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryQuestionOption"
import { randomAutomatedMessage } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { useSendInquiry } from "app/Scenes/Artwork/hooks/useSendInquiry"
import { MyCollectionBottomSheetModalArtistsPrompt } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { LocationWithDetails } from "app/utils/googleMaps"
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { useUpdateCollectorProfile } from "app/utils/mutations/useUpdateCollectorProfile"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { InteractionManager, LayoutChangeEvent, Modal } from "react-native"
import { KeyboardAwareScrollViewRef, KeyboardStickyView } from "react-native-keyboard-controller"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork: _artwork, me }) => {
  const { variant, trackExperiment } = useExperimentVariant(
    "topaz_retire-inquiry-template-messages"
  )

  const { state, dispatch } = useArtworkInquiryContext()
  const color = useColor()
  const space = useSpace()
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null)
  const tracking = useTracking()
  const [commit] = useUpdateCollectorProfile()

  const retireTemplatesExperimentEnabled = !!variant.enabled && variant.name === "experiment"

  const artwork = useFragment(artworkFragment, _artwork)

  const defaultMessageState = retireTemplatesExperimentEnabled ? "" : () => randomAutomatedMessage()
  const [message, setMessage] = useState<string>(defaultMessageState)
  const [addMessageYCoordinate, setAddMessageYCoordinate] = useState<number>(0)
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const [bottomOffset, setBottomOffset] = useState(0)
  const inputRef = useRef<InputRef>(null)

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setBottomOffset(event.nativeEvent.layout.height)
    },
    [setBottomOffset]
  )

  const exit = () => {
    dispatch({ type: "setInquiryModalVisible", payload: false })
  }

  const { sendInquiry, error, sendingInquiry } = useSendInquiry({
    onCompleted: exit,
    artwork,
    me,
  })

  useEffect(() => {
    if (state.inquiryModalVisible) {
      return
    }

    if (!retireTemplatesExperimentEnabled) {
      setTimeout(() => setMessage(randomAutomatedMessage()), 500)
    }

    if (state.shippingLocation || state.inquiryQuestions.length) {
      dispatch({ type: "resetForm", payload: null })
    }
  }, [
    state.inquiryQuestions.length,
    state.shippingLocation,
    state.inquiryModalVisible,
    retireTemplatesExperimentEnabled,
    dispatch,
  ])

  useEffect(() => {
    if (state.inquiryModalVisible && inputRef.current) {
      // TODO: `InteractionManager` is deprecated
      // we need to update it to `requestIdleCallback` when we upgrade to RN 0.82+
      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.focus()
      })
    }
  }, [state.inquiryModalVisible])

  const scrollToInput = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: addMessageYCoordinate })
  }, [addMessageYCoordinate])

  if (!artwork) {
    return null
  }
  const availableInquiryQuestions = artwork.inquiryQuestions

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
    <>
      <Modal
        visible={state.inquiryModalVisible}
        onDismiss={handleDismiss}
        statusBarTranslucent
        navigationBarTranslucent
        animationType="slide"
        onShow={() => {
          trackExperiment({
            context_owner_type: OwnerType.artwork,
            context_owner_screen: OwnerType.artwork,
            context_owner_id: artwork.internalID,
            context_owner_slug: artwork.slug,
          })
        }}
      >
        <Screen>
          <NavigationHeader rightCloseButton onRightButtonPress={handleDismiss}>
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
          <KeyboardAwareForm
            ref={scrollViewRef}
            style={{ flex: 1, backgroundColor: color("mono0") }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            contentInsetAdjustmentBehavior="automatic"
            bottomOffset={bottomOffset}
          >
            <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />

            <Box px={2}>
              {!!availableInquiryQuestions && availableInquiryQuestions.length > 0 && (
                <Box my={2}>
                  <Text variant="sm">What information are you looking for?</Text>
                  {availableInquiryQuestions.map((inquiryQuestion) => {
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
              )}
              <Box
                mb={4}
                onLayout={({ nativeEvent }) => {
                  setAddMessageYCoordinate(nativeEvent.layout.y)
                }}
              >
                <Input
                  ref={inputRef}
                  multiline
                  placeholder="Have questions? Ask about shipping options, pricing, or anything else you’d like to know."
                  title="Your message"
                  accessibilityLabel="Your message"
                  value={message}
                  onChangeText={setMessage}
                  onFocus={scrollToInput}
                  style={{ justifyContent: "flex-start" }}
                />
              </Box>
              <Box flexDirection="row">
                <InfoIcon mr={0.5} style={{ marginTop: 2 }} />
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
          </KeyboardAwareForm>

          <KeyboardStickyView onLayout={handleOnLayout} offset={{ opened: space(2) }}>
            <Box p={2} pb={4} backgroundColor="mono0">
              <Button
                block
                disabled={state.inquiryQuestions.length === 0 && message.trim() === ""}
                loading={sendingInquiry}
                onPress={() => sendInquiry(message)}
              >
                Send
              </Button>
            </Box>
          </KeyboardStickyView>

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
