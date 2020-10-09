import { InquiryModal_artwork } from "__generated__/InquiryModal_artwork.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { ArtworkInquiryContext } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryOptions } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { Box, Button, color, Flex, Separator, space, Text } from "palette"
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
  const [isExpanded, setExpanded] = useState(false)
  const toggleExpanded = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
    setExpanded(!isExpanded)
  }
  const [shippingModalVisibility, setShippingModalVisibility] = useState(false)
  const selectShippingLocation = (l: string) => dispatch({ type: "selectShippingLocation", payload: l })

  const renderInquiryQuestion = (inquiry: string): JSX.Element => {
    return (
      <TouchableOpacity onPress={() => toggleExpanded()} key={inquiry}>
        <InquiryField>
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flexDirection="row">
              <Checkbox
                checked={
                  state.inquiryType === InquiryOptions.RequestPrice && inquiry === InquiryOptions.PriceAvailability
                }
              />
              <Text variant="text">{inquiry}</Text>
            </Flex>
            {inquiry === InquiryOptions.Shipping && (
              <Flex flexDirection="row" mt={0.5}>
                <ChevronIcon color="black60" expanded={isExpanded} initialDirection="down" />
              </Flex>
            )}
          </Flex>

          {inquiry === InquiryOptions.Shipping && !!isExpanded && (
            <>
              <Separator my={2} />
              <Flex flexDirection="row" justifyContent="space-between">
                <Text variant="text" color="black60">
                  Add your location
                </Text>
              </Flex>
            </>
          )}
        </InquiryField>
      </TouchableOpacity>
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
