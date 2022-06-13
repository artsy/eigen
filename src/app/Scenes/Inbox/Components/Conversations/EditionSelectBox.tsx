import { themeGet } from "@styled-system/theme-get"
import { EditionSelectBox_editionSet$data } from "__generated__/EditionSelectBox_editionSet.graphql"
import { useFeatureFlag } from "app/store/GlobalStore"
import { BorderBox, Flex, Text, Touchable } from "palette"
import { RadioButton } from "palette/elements/Radio"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const UnavailableIndicator = styled(View)`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background-color: ${themeGet("colors.red100")};
  margin-right: 6px;
`

interface Props {
  editionSet: EditionSelectBox_editionSet$data
  selected: boolean
  onPress: (editionSetId: string, isAvailable: boolean) => void
}

export const EditionSelectBox: React.FC<Props> = ({ editionSet, selected, onPress }) => {
  const enableConversationalBuyNow = useFeatureFlag("AREnableConversationalBuyNow")
  const available =
    !!editionSet.isOfferableFromInquiry ||
    (enableConversationalBuyNow && !!editionSet.isAcquireable)

  return (
    <Touchable onPress={() => onPress(editionSet.internalID, available)}>
      <BorderBox p={2} my={0.5} flexDirection="row">
        <RadioButton
          selected={selected}
          onPress={() => onPress(editionSet.internalID, available)}
        />
        <Flex mx={1} flexGrow={1}>
          <Text color={available ? "black100" : "black30"}>{editionSet.dimensions?.in}</Text>
          <Text color={available ? "black60" : "black30"} variant="xs">
            {editionSet.dimensions?.cm}
          </Text>
          <Text color={available ? "black60" : "black30"}>{editionSet.editionOf}</Text>
        </Flex>
        {available ? (
          <Text>{editionSet.listPrice?.display || "Price on request"}</Text>
        ) : (
          <Flex flexDirection="row" alignItems="baseline">
            <UnavailableIndicator />
            <Text>Unavailable</Text>
          </Flex>
        )}
      </BorderBox>
    </Touchable>
  )
}

export const EditionSelectBoxFragmentContainer = createFragmentContainer(EditionSelectBox, {
  editionSet: graphql`
    fragment EditionSelectBox_editionSet on EditionSet {
      internalID
      editionOf
      isAcquireable
      isOfferableFromInquiry
      listPrice {
        ... on Money {
          display
        }
        ... on PriceRange {
          display
        }
      }
      dimensions {
        cm
        in
      }
    }
  `,
})
