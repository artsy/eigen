import { BorderBox, color, Flex, Text, Touchable } from "palette"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { MakeOfferModal_artwork } from "__generated__/MakeOfferModal_artwork.graphql"

const UnavailableIndicator = styled(View)`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background-color: ${color("red100")};
  margin-right: 6px;
`

export const RadioButton: React.FC<{ selected: boolean }> = (props) => {
  const { selected } = props
  return (
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: selected ? color("black100") : color("black10"),
        backgroundColor: selected ? color("black100") : color("white100"),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected ? (
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: color("white100"),
          }}
        />
      ) : null}
    </View>
  )
}

interface Props {
  edition: NonNullable<NonNullable<MakeOfferModal_artwork["editionSets"]>[number]>
  selected: boolean
  onPress: (editionSetId: string, isAvailable: boolean) => void
}

export const EditionSelectBox: React.FC<Props> = ({ edition, selected, onPress }) => {
  const [available, setAvailable] = useState<boolean>(false)

  useEffect(() => {
    setAvailable(!!edition.listPrice?.display && !!edition.isOfferableFromInquiry)
  }, [edition])

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
          <Text color={available ? "black60" : "black30"} variant="caption">
            {edition.dimensions?.cm}
          </Text>
          <Text color={available ? "black60" : "black30"}>{edition.editionOf}</Text>
        </Flex>
        {available ? (
          <Text>{edition.listPrice?.display}</Text>
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
