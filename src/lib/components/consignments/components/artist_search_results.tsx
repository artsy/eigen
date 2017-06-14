import * as React from "react"
import { ActivityIndicator, ScrollView, TouchableHighlight, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

import { ArtistResult } from "../index"
import TextInput, { TextInputProps } from "./text_input"

const Result = styled.TouchableHighlight`
  height: 40;
  margin-bottom: 10;
`

const ResultContainers = styled.View`
  flex-direction: row;
  align-items: center;
`

const Image = styled.Image`
  height: 40;
  width: 40;
  border-radius: 20;
`

const Text = styled.Text`
  font-family: "${fonts["garamond-regular"]}";
  color: white;
  font-size: 20;
  padding-top: 8;
  margin-left: 13;
`

const UnknownLabel = styled.Text`
  font-family: "${fonts["garamond-regular"]}";
  color: ${colors["gray-medium"]};
  font-size: 17;
`

const UnknownName = styled.Text`
  font-family: "${fonts["garamond-italic"]}";
  color: ${colors["gray-medium"]};
  font-size: 17;
`

export interface ArtistQueryData extends TextInputProps {
  results: ArtistResult[] | null
  query: string
  onChangeText?: (query: string) => void
  resultSelected?: (result: ArtistResult) => void
}

const noResults = props => {
  if (!props.query || props.searching) {
    return null
  }
  return (
    <UnknownLabel>
      Unfortunately we are not accepting consignments for works by <UnknownName>{props.query}</UnknownName>
    </UnknownLabel>
  )
}

const render = (props: ArtistQueryData) => {
  const rowForResult = result =>
    <Result key={result.id} onPress={() => props.resultSelected(result)}>
      <ResultContainers>
        {result.image ? <Image source={{ uri: result.image.url }} /> : null}
        <Text>{result.name}</Text>
      </ResultContainers>
    </Result>

  return (
    <View>
      <TextInput
        searching={props.searching}
        text={{
          placeholder: "Artist/Designer Name",
          returnKeyType: "search",
          value: props.query,
          onChangeText: props.onChangeText,
          autoFocus: typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
        }}
        style={{ flex: 0 }}
      />

      <ScrollView style={{ height: 182, paddingTop: 16 }} scrollEnabled={props.results && !!props.results.length}>
        {props.results && props.results.length ? props.results.map(rowForResult) : noResults(props)}
      </ScrollView>
    </View>
  )
}

export default class SearchResults extends React.Component<ArtistQueryData, null> {
  render() {
    return render(this.props)
  }
}
