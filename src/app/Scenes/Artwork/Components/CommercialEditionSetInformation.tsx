import { CommercialEditionSetInformation_artwork } from "__generated__/CommercialEditionSetInformation_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { Box, Flex, RadioButton, Sans, Spacer } from "palette"
import React from "react"
import { injectIntl, IntlShape } from "react-intl"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { CommercialPartnerInformationFragmentContainer as CommercialPartnerInformation } from "./CommercialPartnerInformation"

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
type EditionSet = CommercialEditionSetInformation_artwork["editionSets"][0]

interface Props {
  artwork: CommercialEditionSetInformation_artwork
  setEditionSetId: (editionSetID: string) => void
  intl: IntlShape
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

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  selectEdition = (internalID) => {
    const { setEditionSetId, artwork } = this.props
    const editionSets = artwork.editionSets
    this.setState({
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      selectedEdition: editionSets.find((edition) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
          {this.props.intl.formatMessage({
            id: "scene.artwork.components.commercialEditionSetInformation.editionSize",
            defaultMessage: "Edition size",
          })}
        </Sans>
        <Flex flexDirection="row" alignContent="center" flexWrap="wrap">
          {editionSets.map((edition) => {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            const { id, internalID, dimensions } = edition
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            const selected = internalID === selectedEdition.internalID
            return (
              <TouchableWithoutFeedback key={id} onPress={() => this.selectEdition(internalID)}>
                <Box height={26} mt={1} mr={2} flexDirection="row">
                  <RadioButton selected={selected} onPress={() => this.selectEdition(internalID)} />
                  <Sans size="2" weight="medium" color="black100">
                    {LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
                      ? dimensions.in
                      : dimensions.cm}
                  </Sans>
                </Box>
              </TouchableWithoutFeedback>
            )
          })}
        </Flex>
        {!!selectedEdition! /* STRICTNESS_MIGRATION */.editionOf && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black30">
              {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                selectedEdition.editionOf
              }
            </Sans>
          </>
        )}
        {!!selectedEdition! /* STRICTNESS_MIGRATION */.saleMessage && (
          <>
            <Spacer mb={2} />

            <Sans size="4" weight="medium" color="black100">
              {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                selectedEdition.saleMessage
              }
            </Sans>
          </>
        )}
        <CommercialPartnerInformation artwork={artwork} />
      </Box>
    )
  }
}

export const CommercialEditionSetInformationFragmentContainer = createFragmentContainer(
  injectIntl(CommercialEditionSetInformation),
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
