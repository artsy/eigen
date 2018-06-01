import _ from "lodash"
import React from "react"
import { Text, ViewProperties } from "react-native"
import SimpleMarkdown from "simple-markdown"
import styled from "styled-components/native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Flex, FlexProps } from "../Elements/Flex"
import { Serif16 } from "../Elements/Typography"

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
    text: {
      react: node => {
        return node.content
      },
    },
  },

  paragraph: {
    ...SimpleMarkdown.defaultRules.paragraph,
    match: SimpleMarkdown.blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
    react: (node, output, state) => {
      return (
        <Serif16 color="black60" key={state.key} textAlign="center">
          {output(node.content, state)}
        </Serif16>
      )
    },
  },

  newline: {
    react: (_node, _output, state) => {
      return <Text key={state.key}>{"\n"}</Text>
    },
  },
}

export class Markdown extends React.Component<ViewProperties & FlexProps> {
  private readonly rawBuiltParser = SimpleMarkdown.parserFor(rules)

  private readonly reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, "react"))

  render() {
    const child = _.isArray(this.props.children) ? this.props.children.join("") : this.props.children

    return <Flex {...this.props}>{this.reactOutput(this.parse(child))}</Flex>
  }

  private parse(source) {
    return this.rawBuiltParser(source + "\n\n", { inline: false })
  }
}

export const LinkText = styled.Text`
  text-decoration-line: underline;
`
