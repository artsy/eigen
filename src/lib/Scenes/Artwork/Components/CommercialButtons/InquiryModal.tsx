import { InquiryModal_artwork } from "__generated__/InquiryModal_artwork.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { ArtworkInquiryContext } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryOptions } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { Box, color, Flex, Separator, space, Text } from "palette"
import React, { useContext, useState } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"
import { ShippingModal } from "./ShippingModal"

interface InquiryModalProps {
  artwork: InquiryModal_artwork
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork, ...props }) => {
  const { toggleVisibility, modalIsVisible } = props
  const questions = artwork?.inquiryQuestions!
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const [locationExpanded, setLocationExpanded] = useState(false)
  const toggleLocationExpanded = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
    setLocationExpanded(!locationExpanded)
  }
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const selectShippingLocation = (l: string) => dispatch({ type: "selectShippingLocation", payload: l })

  const renderInquiryQuestion = (inquiry: string): JSX.Element => {
    // Shipping requires special logic to accomodate dropdown and shipping modal
    const isShipping = inquiry === InquiryOptions.Shipping

    return (
      <React.Fragment key={inquiry}>
        <InquiryField>
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flexDirection="row">
              <Checkbox
                data-test-id={`checkbox-${inquiry}`}
                checked={
                  state.inquiryType === InquiryOptions.RequestPrice && inquiry === InquiryOptions.PriceAvailability
                }
                onPress={() => isShipping && toggleLocationExpanded()}
              />
              <Text variant="text">{inquiry}</Text>
            </Flex>
          </Flex>

          {!!isShipping && !!locationExpanded && (
            <>
              <Separator my={2} />
              <TouchableOpacity
                data-test-id="toggle-shipping-modal"
                onPress={() => {
                  setShippingModalVisibility(true)
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
                        {state.shippingLocation}
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

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => toggleVisibility()}>
        Contact Gallery
      </FancyModalHeader>
      <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />
      <Box m={2}>
        <Text variant="mediumText">What information are you looking for?</Text>
        {
          // @ts-ignore
          // NOTE: For now the inquiryQuestions field values are always present and therefore never null, so it is safe to destructure them
          questions!.map(({ question }: string) => {
            return renderInquiryQuestion(question)
          })
        }
      </Box>
      <ShippingModal
        toggleVisibility={() => setShippingModalVisibility(!shippingModalVisibility)}
        modalIsVisible={shippingModalVisibility}
        setLocation={selectShippingLocation}
        location={state.shippingLocation as string}
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
      inquiryQuestions {
        question
      }
    }
  `,
})
