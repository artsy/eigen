import * as React from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const Input = styled.TextInput`
  height: 40
  backgroundColor: black
  color: white
  font-family: "${fonts["garamond-regular"]}"
  font-size: 20
  border-bottom-color: white
  border-bottom-width: 1
  flex: 1
`

const Result = styled.View`
  flex-direction: row
  align-items: center
  height: 40
  margin-bottom: 10
`

const Image = styled.Image`
  height: 40
  width: 40
  border-radius: 20
`

const Text = styled.Text`
  font-family: "${fonts["garamond-regular"]}"
  color: white
  font-size: 20
  padding-top: 8
  margin-left: 13
`

const UnknownLabel = styled.Text`
  font-family: "${fonts["garamond-regular"]}"
  color: ${colors["gray-medium"]}
  font-size: 17
`

const UnknownName = styled.Text`
  font-family: "${fonts["garamond-italic"]}"
  color: ${colors["gray-medium"]}
  font-size: 17
`

const Separator = styled.View`
  background-color: ${colors["gray-regular"]}
  height: 1
`

export interface ArtistQueryData {
  query: string,
  searching: boolean,
  results: Array<{ name: string, id: string, image: { url: string } }> | null
  textDidChange?: (text: string) => void
}

const rowForResult = (result) =>
  <Result key={result.id}>
    <Image source={{uri: result.image.url}} />
    <Text>{result.name}</Text>
  </Result>

const noResults = (props) => {
   if (!props.query || props.searching) { return null }
   return <UnknownLabel>
    Unfortunately we are not accepting consignments for works by <UnknownName>{props.query}</UnknownName>
   </UnknownLabel>
}

const render = (props: ArtistQueryData) =>
  <View>

    <View style={{flexDirection: "row"}}>
      <Input
        autoFocus={typeof(jest) === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */}
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={props.textDidChange}
        defaultValue="Artist/Designer Name"
        keyboardAppearance="dark"
        placeholderTextColor={ colors["gray-medium"] }
        value={props.query}
        returnKeyType="search"
        selectionColor={ colors["gray-medium"] }
      />
      <ActivityIndicator animating={props.searching} />
    </View>

    <Separator/>

    <ScrollView style={{height: 182, paddingTop: 16}} scrollEnabled={props.results && !!props.results.length}>
      {props.results && props.results.length ? props.results.map(rowForResult) : noResults(props) }
    </ScrollView>
  </View>

// Export a pure component version
export default class SearchResults extends React.PureComponent<ArtistQueryData, null> {
  render() { return render(this.props) }
}
