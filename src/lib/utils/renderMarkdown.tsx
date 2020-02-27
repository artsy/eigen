import { color, Sans, Separator, Serif, space } from "@artsy/palette"
import { LinkText } from "lib/Components/Text/LinkText"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import _ from "lodash"
import React from "react"
import { Linking, Text, View } from "react-native"
import SimpleMarkdown, { ParserRule, ParserRules, ReactNodeOutput } from "simple-markdown"

interface OurReactRule extends Partial<ParserRule> {
  // simpler typings here, for better intellisense
  react?: ReactNodeOutput
}

// just to get better intellisense when creating the rules
function createReactRules(
  rules: Partial<
    {
      [k in keyof SimpleMarkdown.DefaultRules]: OurReactRule
    }
  >
): ParserRules {
  const result: any = {}
  for (const key of Object.keys(SimpleMarkdown.defaultRules)) {
    if (rules[key]) {
      result[key] = {
        ...SimpleMarkdown.defaultRules[key],
        ...rules[key],
      }
    } else {
      result[key] = SimpleMarkdown.defaultRules[key]
    }
  }
  return result
}

// Rules for rendering parsed markdown. Currently only handles links and text. Add rules similar to
// https://github.com/CharlesMangwa/react-native-simple-markdown/blob/next/src/rules.js for new functionalities.
//
// Default rules: https://github.com/Khan/simple-markdown/blob/f1a75785703832bbff146d0b98e76cd7ac74b8e8/simple-markdown.js#L806
export function defaultRules(modal: boolean = false): ParserRules {
  return createReactRules({
    link: {
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
      react: node => {
        return node.content
      },
    },

    paragraph: {
      match: SimpleMarkdown.blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => {
        return (
          <Sans size="3t" key={state.key} textAlign="center">
            {output(node.content, state)}
          </Sans>
        )
      },
    },

    strong: {
      react: (node, output, state) => {
        return (
          <Serif size="3t" weight="semibold" key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },

    em: {
      react: (node, output, state) => {
        return (
          <Serif size="3t" italic key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },

    br: {
      react: (_node, _output, state) => {
        return <Text key={state.key} />
      },
    },

    newline: {
      react: (_node, _output, state) => {
        return <Text key={state.key} />
      },
    },

    list: {
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
            <Serif size="3t" key={String(state.key) + 1}>
              {output(item, state)}
            </Serif>
          )
          return (
            <View key={i} style={{ flexDirection: "row" }}>
              <Text>
                {bullet} {listItemText}
              </Text>
            </View>
          )
        })
        return <View>{items}</View>
      },
    },

    codeBlock: {
      react: (node, _output, state) => {
        return (
          <Sans size="3t" key={state.key}>
            {node.content}
          </Sans>
        )
      },
    },

    inlineCode: {
      react: (node, _output, state) => {
        return (
          <Sans size="3t" key={state.key}>
            {node.content}
          </Sans>
        )
      },
    },

    heading: {
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
    u: {
      react: (node, output, state) => output(node.content, state),
    },
    del: {
      react: (node, output, state) => output(node.content, state),
    },
    image: {
      react: () => null,
    },
    table: {
      react: () => null,
    },
    tableSeparator: {
      react: () => null,
    },
    blockQuote: {
      react: (node, output, state) => (
        <View style={{ borderLeftColor: color("black10"), borderLeftWidth: 2, paddingLeft: space(1) }}>
          {output(node.content, state)}
        </View>
      ),
    },
    hr: {
      react: () => <Separator mb={2}></Separator>,
    },
  })
}

export function renderMarkdown(markdown: string, rules: any = defaultRules(false)): React.ReactElement {
  const parser = SimpleMarkdown.parserFor(rules)
  const writer = SimpleMarkdown.outputFor<any, any>(rules, "react")

  const ast = parser(markdown, { inline: false })

  return writer(ast)
}
