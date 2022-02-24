import { themeGet } from "@styled-system/theme-get"
import { BorderBox, Flex, Text, Touchable } from "palette"
import { RadioButton } from "palette/elements/Radio"
import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { MakeOfferModal_artwork } from "__generated__/MakeOfferModal_artwork.graphql"

const UnavailableIndicator = styled(View)`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background-color: ${themeGet("colors.red100")};
  margin-right: 6px;
`

interface Props {
  edition: NonNullable<NonNullable<MakeOfferModal_artwork["editionSets"]>[number]>
  selected: boolean
  onPress: (editionSetId: string, isAvailable: boolean) => void
}

export const EditionSelectBox: React.FC<Props> = ({ edition, selected, onPress }) => {
  const available = !!edition.isOfferableFromInquiry

  return (
    <Touchable
      onPress={() => {
        onPress(edition.internalID, available)
      }}
    >
      <BorderBox p={2} my={0.5} flexDirection="row">
        <RadioButton selected={selected} />
        <Flex mx={1} flexGrow={1}>
          <Text color={available ? "black100" : "black30"}>{edition.dimensions?.in}</Text>
          <Text color={available ? "black60" : "black30"} variant="xs">
            {edition.dimensions?.cm}
          </Text>
          <Text color={available ? "black60" : "black30"}>{edition.editionOf}</Text>
        </Flex>
        {available ? (
          <Text>{edition.listPrice?.display || "Price on Request"}</Text>
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
