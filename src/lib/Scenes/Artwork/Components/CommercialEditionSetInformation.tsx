import { Box, color, Flex, Sans, Spacer } from "@artsy/palette"
import { CommercialEditionSetInformation_artwork } from "__generated__/CommercialEditionSetInformation_artwork.graphql"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

type EditionSet = CommercialEditionSetInformation_artwork["editionSets"][0]

interface Props {
  artwork: CommercialEditionSetInformation_artwork
  setEditionSetId: (editionSetID: string) => void
}

interface State {
  selectedEdition: EditionSet
}

export class CommercialEditionSetInformation extends React.Component<Props, State> {
  state = {
    selectedEdition: this.props.artwork.editionSets[0],
  }

  selectEdition = id => {
    const { setEditionSetId, artwork } = this.props
    const editionSets = artwork.editionSets
    this.setState({
      selectedEdition: editionSets.find(edition => {
        return edition.dimensions.in === id
      }),
    })
    setEditionSetId(id)
  }

  render() {
    const { artwork } = this.props
    const { selectedEdition } = this.state
    const editionSets = artwork.editionSets
    if (!editionSets && editionSets.length) {
      return <></>
    }
    return (
      <Box>
        <Sans size="3" weight="medium">
          Size
        </Sans>
        <Spacer mb={1} />
        <Flex flexDirection="row" alignContent="center">
          {editionSets.map(edition => {
            const { dimensions } = edition
            const selected = dimensions.in === selectedEdition.dimensions.in
            return (
              <TouchableWithoutFeedback key={dimensions.in} onPress={() => this.selectEdition(dimensions.in)}>
                <EditionSelector p={1} mr={1} selected={selected}>
                  <Sans size="3t" color={selected ? "black100" : "black30"}>
                    {dimensions.in}
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
            <Sans size="4" color="black100">
              {selectedEdition.saleMessage}
            </Sans>
          </>
        )}
        <Spacer mb={2} />
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
          isAcquireable
          isOfferable
          saleMessage
          editionOf
          dimensions {
            in
            cm
          }
        }
      }
    `,
  }
)

interface EditionSelectorProps {
  selected: boolean
}

const EditionSelector = styled(Box)<EditionSelectorProps>`
  border-radius: 5px;
  border: ${props => (props.selected ? `2px solid ${color("black100")}` : `2px solid ${color("black30")}`)};
`
