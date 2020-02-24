import { Box, color, Flex, Sans, Spacer } from "@artsy/palette"
import { CommercialEditionSetInformation_artwork } from "__generated__/CommercialEditionSetInformation_artwork.graphql"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { CommercialPartnerInformationFragmentContainer as CommercialPartnerInformation } from "./CommercialPartnerInformation"

const Constants = NativeModules.ARCocoaConstantsModule

type EditionSet = CommercialEditionSetInformation_artwork["editionSets"][0]

interface Props {
  artwork: CommercialEditionSetInformation_artwork
  setEditionSetId: (editionSetID: string) => void
}

interface State {
  selectedEdition: EditionSet | null
}

export class CommercialEditionSetInformation extends React.Component<Props, State> {
  state = {
    selectedEdition:
      this.props.artwork && this.props.artwork.editionSets && this.props.artwork.editionSets.length
        ? this.props.artwork.editionSets[0]
        : null,
  }

  componentDidMount() {
    const { selectedEdition } = this.state
    if (selectedEdition && selectedEdition.internalID) {
      this.props.setEditionSetId(selectedEdition.internalID)
    }
  }

  selectEdition = internalID => {
    const { setEditionSetId, artwork } = this.props
    const editionSets = artwork.editionSets
    this.setState({
      selectedEdition: editionSets.find(edition => {
        return edition.internalID === internalID
      }),
    })
    setEditionSetId(internalID)
  }

  render() {
    const { artwork } = this.props
    const { selectedEdition } = this.state

    const editionSets = artwork.editionSets

    if (!editionSets || !editionSets.length) {
      return <></>
    }

    return (
      <Box>
        <Sans size="3" weight="medium">
          Edition size
        </Sans>
        <Flex flexDirection="row" alignContent="center" flexWrap="wrap">
          {editionSets.map(edition => {
            const { id, internalID, dimensions } = edition
            const selected = internalID === selectedEdition.internalID
            return (
              <TouchableWithoutFeedback key={id} onPress={() => this.selectEdition(internalID)}>
                <EditionSelector px={2} height={26} mt={1} mr={1} selected={selected}>
                  <Sans size="2" weight="medium" color="black100">
                    {Constants.CurrentLocale === "en_US" ? dimensions.in : dimensions.cm}
                  </Sans>
                </EditionSelector>
              </TouchableWithoutFeedback>
            )
          })}
        </Flex>
        {!!selectedEdition.editionOf && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black30">
              {selectedEdition.editionOf}
            </Sans>
          </>
        )}
        {!!selectedEdition.saleMessage && (
          <>
            <Spacer mb={2} />

            <Sans size="4" weight="medium" color="black100">
              {selectedEdition.saleMessage}
            </Sans>
          </>
        )}
        <CommercialPartnerInformation artwork={artwork} />
      </Box>
    )
  }
}

export const CommercialEditionSetInformationFragmentContainer = createFragmentContainer(
  CommercialEditionSetInformation,
  {
    artwork: graphql`
      fragment CommercialEditionSetInformation_artwork on Artwork {
        editionSets {
          id
          internalID
          saleMessage
          editionOf

          dimensions {
            in
            cm
          }
        }

        ...CommercialPartnerInformation_artwork
      }
    `,
  }
)

interface EditionSelectorProps {
  selected: boolean
}

const EditionSelector = styled(Box)<EditionSelectorProps>`
  border-radius: 3;
  align-items: center;
  justify-content: center;
  border: ${props => (props.selected ? `2px solid ${color("black100")}` : `2px solid ${color("black30")}`)};
`
