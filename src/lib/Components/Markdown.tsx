import { Flex, FlexProps, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import _ from "lodash"
import React from "react"
import { Text } from "react-native"
import SimpleMarkdown from "simple-markdown"
import { LinkText } from "./Text/LinkText"

// Rules for rendering parsed markdown. Currently only handles links and text. Add rules similar to
// https://github.com/CharlesMangwa/react-native-simple-markdown/blob/next/src/rules.js for new functionalities.
export const defaultRules = {
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
        <Sans size="3t" color="black60" key={state.key} textAlign="center">
          {output(node.content, state)}
        </Sans>
      )
    },
  },

  newline: {
    ...SimpleMarkdown.defaultRules.newline,
    react: (_node, _output, state) => {
      return <Text key={state.key}>{"\n"}</Text>
    },
  },

  strong: {
    ...SimpleMarkdown.defaultRules.strong,
    react: (node, output, state) => {
      return (
        <Sans size="3t" weight="medium" key={state.key}>
          {output(node.content, state)}
        </Sans>
      )
    },
  },

  br: {
    ...SimpleMarkdown.defaultRules.br,
    react: (_node, _output, state) => {
      return <Text key={state.key}>{"\n\n"}</Text>
    },
  },
}

interface Props {
  rules?: { [key: string]: any }
}

export class Markdown extends React.Component<Props & FlexProps> {
  static defaultProps = {
    rules: defaultRules,
  }
  rawBuiltParser: any
  reactOutput: any

  constructor(props) {
    super(props)
    this.buildParser()
  }

  buildParser() {
    const { rules } = this.props
    this.rawBuiltParser = SimpleMarkdown.parserFor(rules)
    this.reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, "react"))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rules !== this.props.rules) {
      this.buildParser()
    }
  }

  render() {
    const child = _.isArray(this.props.children) ? this.props.children.join("") : this.props.children
    const { rules, ...rest } = this.props

    return <Flex {...rest}>{this.reactOutput(this.parse(child))}</Flex>
  }

  private parse(source) {
    return this.rawBuiltParser(source + "\n\n", { inline: false })
  }
}
