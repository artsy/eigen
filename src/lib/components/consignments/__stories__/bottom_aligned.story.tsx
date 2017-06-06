import * as React from "react"
import { Text, View } from "react-native"

import Search from "../components/artist_search_results"
import BottomAlignedButton, { BottomAlignedProps } from "../components/bottom_aligned_button"

export const name = "Consignments - bottom aligned"
export const component = BottomAlignedButton

interface States {
  [name: string]: BottomAlignedProps
}

const withText = {
  children: [<Text style={{color: "white"}}>hi</Text>],
  onPress: () => "" ,
}

const withSearchResults = {
  children: [<Search searching={false} query="Banko" results={null} />],
  onPress: () => "",
}

export const allStates: States[] = [
  { "With a Text element" : withText },
  { "With an Artist Search Results Component" : withSearchResults },
]

// TODO: Make a component that animates keyboard back and forth
