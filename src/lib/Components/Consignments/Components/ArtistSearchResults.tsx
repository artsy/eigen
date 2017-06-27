import * as React from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

import TextInput, { TextInputProps } from "./TextInput"

const Result = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40;
  margin-bottom: 10;
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
  results: Array<{ name: string; id: string; image: { url: string } }> | null
  query: string
  onChangeText?: (query: string) => void
}

const rowForResult = result =>
  <Result key={result.id}>
    <Image source={{ uri: result.image.url }} />
    <Text>
      {result.name}
    </Text>
  </Result>

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

const render = (props: ArtistQueryData) =>
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

export default class SearchResults extends React.Component<ArtistQueryData, null> {
  render() {
    return render(this.props)
  }
}
