import { Sans, Serif } from "@artsy/palette"
import { LinkText } from "lib/Components/Text/LinkText"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import _ from "lodash"
import React from "react"
import { Linking, Text, View } from "react-native"
import SimpleMarkdown from "simple-markdown"

// Rules for rendering parsed markdown. Currently only handles links and text. Add rules similar to
// https://github.com/CharlesMangwa/react-native-simple-markdown/blob/next/src/rules.js for new functionalities.
//
// Default rules: https://github.com/Khan/simple-markdown/blob/f1a75785703832bbff146d0b98e76cd7ac74b8e8/simple-markdown.js#L806
export function defaultRules(modal: boolean = false) {
  return {
    ...SimpleMarkdown.defaultRules,
    link: {
      ...SimpleMarkdown.defaultRules.link,
      react: (node, output, state) => {
        state.withinText = true
        let element
        const openUrl = url => {
          if (node.target.startsWith("mailto:")) {
            Linking.canOpenURL(url)
              .then(supported => {
                if (!supported) {
                  console.log("Unable to handle URL: " + url)
                } else {
                  return Linking.openURL(url)
                }
              })
              .catch(err => console.error("An error occurred", err))
          } else if (modal) {
            SwitchBoard.presentModalViewController(element, url)
          } else {
            SwitchBoard.presentNavigationViewController(element, url)
          }
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

    strong: {
      ...SimpleMarkdown.defaultRules.strong,
      react: (node, output, state) => {
        return (
          <Serif size="3t" weight="semibold" key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },

    em: {
      ...SimpleMarkdown.defaultRules.em,
      react: (node, output, state) => {
        return (
          <Serif size="3t" italic key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },

    br: {
      ...SimpleMarkdown.defaultRules.br,
      react: (_node, _output, state) => {
        return <Text key={state.key} />
      },
    },

    newline: {
      ...SimpleMarkdown.defaultRules.newline,
      react: (_node, _output, state) => {
        return <Text key={state.key} />
      },
    },

    list: {
      ...SimpleMarkdown.defaultRules.list,

      react: (node, output, state) => {
        const items = _.map(node.items, (item, i) => {
          let bullet
          if (node.ordered) {
            bullet = <Serif size="3t" key={state.key}>{`${i + 1} . `}</Serif>
          } else {
            bullet = (
              <Serif size="3t" key={state.key}>
                -{" "}
              </Serif>
            )
          }

          const listItemText = (
            <Serif size="3t" key={state.key + 1}>
              {output(item, state)}
            </Serif>
          )
          return (
            <View key={i} style={{ flexDirection: "row" }}>
              {bullet} {listItemText}
            </View>
          )
        })
        return <View>{items}</View>
      },
    },

    codeBlock: {
      react: (node, output, state) => {
        return (
          <Sans size="3t" key={state.key}>
            {output(node.content, state)}
          </Sans>
        )
      },
    },

    inlineCode: {
      react: (node, output, state) => {
        return (
          <Sans size="3t" key={state.key}>
            {output(node.content, state)}
          </Sans>
        )
      },
    },

    heading: {
      ...SimpleMarkdown.defaultRules.heading,
      react: (node, output, state) => {
        const map = {
          1: "8",
          2: "6",
          3: "5t",
          4: "5",
        }
        const size = map[node.level] || "4"
        return (
          <Sans mb="1" key={state.key} size={size}>
            {output(node.content, state)}
          </Sans>
        )
      },
    },
  }
}

export function renderMarkdown(markdown: string, rules: any = defaultRules(false)): React.ReactElement {
  const rawBuiltParser = SimpleMarkdown.parserFor(rules)
  const reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, "react"))

  return reactOutput(rawBuiltParser(markdown, { inline: false }))
}
