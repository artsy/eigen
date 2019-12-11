import { Box, color, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import React from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import TextInput, { TextInputProps } from "./TextInput"

const Image = styled.Image`
  height: 40;
  width: 40;
  border-radius: 20;
`

export interface SearchQueryProps<T> extends TextInputProps {
  results: ReadonlyArray<T> | null
  query: string
  placeholder: string
  noResultsMessage: string
  onChangeText?: (query: string) => void
  resultSelected?: (result: T) => void
}

const noResults = props => {
  if (!props.query || props.searching) {
    return null
  }
  return (
    <Serif size="3t" color={color("black60")}>
      {props.noResultsMessage} {props.query}
    </Serif>
  )
}

function render<T>(props: SearchQueryProps<T>) {
  const rowForResult = result => {
    return (
      <Box key={result.internalID}>
        <TouchableOpacity onPress={() => props.resultSelected(result)}>
          <Flex flexDirection="row" flexWrap="nowrap" alignItems="center">
            <Box>{result.image && <Image source={{ uri: result.image.url }} />}</Box>
            <Spacer mr={1} />
            <Sans size="3t">{result.name}</Sans>
          </Flex>
        </TouchableOpacity>
        <Spacer mb={1} />
      </Box>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 540,
        alignSelf: "center",
        paddingTop: 20,
      }}
    >
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
        keyboardShouldPersistTaps="always"
      >
        {props.results && props.results.length ? props.results.map(rowForResult) : noResults(props)}
      </ScrollView>
    </View>
  )
}

export class SearchResults<T> extends React.Component<SearchQueryProps<T>, null> {
  render() {
    return render<T>(this.props)
  }
}
