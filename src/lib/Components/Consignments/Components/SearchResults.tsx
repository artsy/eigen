import * as React from "react"
import { ActivityIndicator, ScrollView, TouchableHighlight, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

import { SearchResult } from "../"
import TextInput, { TextInputProps } from "./TextInput"

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

export interface SearchQueryProps extends TextInputProps {
  results: SearchResult[] | null
  query: string
  placeholder: string
  noResultsMessage: string
  onChangeText?: (query: string) => void
  resultSelected?: (result: SearchResult) => void
}

const noResults = props => {
  if (!props.query || props.searching) {
    return null
  }
  return (
    <UnknownLabel>
      {props.noResultsMessage} <UnknownName>{props.query}</UnknownName>
    </UnknownLabel>
  )
}

const render = (props: SearchQueryProps) => {
  const rowForResult = result =>
    <Result key={result.id} onPress={() => props.resultSelected(result)}>
      <ResultContainers>
        {result.image && <Image source={{ uri: result.image.url }} />}
        <Text>
          {result.name}
        </Text>
      </ResultContainers>
    </Result>

  return (
    <View>
      <TextInput
        searching={props.searching}
        preImage={props.preImage}
        text={{
          placeholder: props.placeholder,
          returnKeyType: "search",
          value: props.query,
          onChangeText: props.onChangeText,
          autoFocus: typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */,
        }}
      />

      <ScrollView
        style={{ height: 182, paddingTop: 16 }}
        scrollEnabled={props.results && !!props.results.length}
        keyboardShouldPersistTaps={true}
      >
        {props.results && props.results.length ? props.results.map(rowForResult) : noResults(props)}
      </ScrollView>
    </View>
  )
}

export default class SearchResults extends React.Component<SearchQueryProps, null> {
  render() {
    return render(this.props)
  }
}
