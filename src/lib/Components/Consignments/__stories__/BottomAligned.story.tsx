import React from "react"
import { Text } from "react-native"

import BottomAlignedButton, { BottomAlignedProps } from "../Components/BottomAlignedButton"
import { SearchResults } from "../Components/SearchResults"

export const name = "Consignments/BottomButton"
export const component = BottomAlignedButton

interface States {
  [name: string]: BottomAlignedProps
}

const doneButtonStyles = {
  backgroundColor: "black",
  marginBottom: 20,
  paddingTop: 18,
  height: 56,
}

const withText = {
  children: [
    <Text key="text" style={{ color: "white" }}>
      hi
    </Text>,
  ],
  onPress: () => "",
  bodyStyle: doneButtonStyles,
  buttonText: "DONE",
}

const withSearchResults = {
  children: [
    <SearchResults
      key="search"
      placeholder="Example"
      noResultsMessage="> "
      searching={false}
      query="Banko"
      results={null}
    />,
  ],
  onPress: () => "",
  bodyStyle: doneButtonStyles,
  buttonText: "DONE",
}

export const allStates: States[] = [
  { "With a Text element": withText },
  { "With an Artist Search Results Component": withSearchResults },
]

// TODO: Make a component that animates keyboard back and forth
