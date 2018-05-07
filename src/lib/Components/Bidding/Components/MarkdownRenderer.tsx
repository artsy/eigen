import React from "react"
import { Text, View } from "react-native"
import SimpleMarkdown from "simple-markdown"
import styled from "styled-components/native"

import { Row } from "../Elements/Grid"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

// Rules for rendering parsed markdown. Currently only handles links and text. Add rules similar to
// https://github.com/CharlesMangwa/react-native-simple-markdown/blob/next/src/rules.js for new functionalities.
const rules = {
  ...SimpleMarkdown.defaultRules,
  link: {
    ...SimpleMarkdown.defaultRules.link,
    react: (node, output, state) => {
      state.withinText = true
      let element
      const openUrl = url => {
        SwitchBoard.presentModalViewController(element, url)
      }
      return (
        <LinkText key={state.key} onPress={() => openUrl(node.target)} ref={el => (element = el)}>
          {output(node.content, state)}
        </LinkText>
      )
    },
  },
  text: {
    ...SimpleMarkdown.defaultRules.text,
    react: (node, _output, state) => {
      return <Text key={state.key}>{node.content}</Text>
    },
  },
  paragraph: {
    ...SimpleMarkdown.defaultRules.paragraph,
    react: (node, output, state) => {
      return (
        <Row style={{ flexDirection: "row" }} key={state.key}>
          {output(node.content, state)}
        </Row>
      )
    },
  },
}
// Markdown parser setup
const rawBuiltParser = SimpleMarkdown.parserFor(rules)
const parser = source => {
  const blockSource = source + "\n\n"
  return rawBuiltParser(blockSource, { inline: false })
}
const reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, "react"))

export const toReact = md => {
  const syntaxTree = parser(md)
  return reactOutput(syntaxTree)
}

interface NariveMarkdownProps {
  md: string
}

export class MarkdownRenderer extends React.Component<NariveMarkdownProps> {
  render() {
    return <View key={0}>{reactOutput(parser(this.props.md))}</View>
  }
}

const LinkText = styled.Text`
  text-decoration-line: underline;
`
