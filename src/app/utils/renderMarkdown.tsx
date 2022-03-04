import { navigate } from "app/navigation/navigate"
import { decode } from "html-entities"
import _ from "lodash"
import { ClassTheme, LinkText, Sans, Separator, Serif, Text } from "palette"
import React from "react"
import { Text as RNText, View } from "react-native"
import SimpleMarkdown, { ParserRule, ParserRules, ReactNodeOutput } from "simple-markdown"
import { sendEmailWithMailTo } from "./sendEmail"

interface OurReactRule extends Partial<ParserRule> {
  // simpler typings here, for better intellisense
  react?: ReactNodeOutput
}

type MarkdownRules = Partial<{ [k in keyof SimpleMarkdown.DefaultRules]: OurReactRule }>

// just to get better intellisense when creating the rules
function createReactRules(rules: MarkdownRules): ParserRules {
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
export function defaultRules({
  modal = false,
  ruleOverrides = {},
  useNewTextStyles = false,
}: {
  modal?: boolean
  ruleOverrides?: MarkdownRules
  useNewTextStyles?: boolean
}): ParserRules {
  return createReactRules({
    link: {
      react: (node, output, state) => {
        state.withinText = true
        const openUrl = (url: string) => {
          if (node.target.startsWith("mailto:")) {
            sendEmailWithMailTo(url)
          } else if (modal) {
            navigate(url, { modal: true })
          } else {
            navigate(url)
          }
        }

        return (
          <LinkText
            key={state.key}
            testID={`linktext-${state.key}`}
            onPress={() => openUrl(node.target)}
          >
            {output(node.content, state)}
          </LinkText>
        )
      },
    },
    text: {
      react: (node) => {
        return decode(node.content)
      },
    },

    paragraph: {
      match: SimpleMarkdown.blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
      react: (node, output, state) => {
        return useNewTextStyles ? (
          <Text variant="sm" key={state.key}>
            {output(node.content, state)}
          </Text>
        ) : (
          <Sans size="3t" color="black60" key={state.key} textAlign="center">
            {output(node.content, state)}
          </Sans>
        )
      },
    },

    strong: {
      react: (node, output, state) => {
        return useNewTextStyles ? (
          <Text variant="sm" key={state.key}>
            {output(node.content, state)}
          </Text>
        ) : (
          <Serif size="3t" weight="semibold" key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },

    em: {
      react: (node, output, state) => {
        return useNewTextStyles ? (
          <Text variant="sm" fontStyle="italic" key={state.key}>
            {output(node.content, state)}
          </Text>
        ) : (
          <Serif size="3t" italic key={state.key}>
            {output(node.content, state)}
          </Serif>
        )
      },
    },

    br: {
      react: (_node, _output, state) => {
        return <RNText key={state.key} />
      },
    },

    newline: {
      react: (_node, _output, state) => {
        return <RNText key={state.key} />
      },
    },

    list: {
      react: (node, output, state) => {
        const items = _.map(node.items, (item, i) => {
          let bullet
          if (node.ordered) {
            bullet = useNewTextStyles ? (
              <Text variant="sm" key={state.key}>{`${i + 1} . `}</Text>
            ) : (
              <Serif size="3t" key={state.key}>{`${i + 1} . `}</Serif>
            )
          } else {
            bullet = useNewTextStyles ? (
              <Text variant="sm" key={state.key}>
                -{" "}
              </Text>
            ) : (
              <Serif size="3t" key={state.key}>
                -{" "}
              </Serif>
            )
          }

          const listItemText = useNewTextStyles ? (
            <Text variant="sm" key={String(state.key) + 1}>
              {output(node.content, state)}
            </Text>
          ) : (
            <Serif size="3t" key={String(state.key) + 1}>
              {output(item, state)}
            </Serif>
          )
          return (
            <View key={i} style={{ flexDirection: "row" }}>
              <RNText>
                {bullet} {listItemText}
              </RNText>
            </View>
          )
        })
        return <View>{items}</View>
      },
    },

    codeBlock: {
      react: (node, _output, state) => {
        return useNewTextStyles ? (
          <Text variant="sm" key={state.key}>
            {node.content}
          </Text>
        ) : (
          <Sans size="3t" key={state.key}>
            {node.content}
          </Sans>
        )
      },
    },

    inlineCode: {
      react: (node, _output, state) => {
        return useNewTextStyles ? (
          <Text variant="sm" key={state.key}>
            {node.content}
          </Text>
        ) : (
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

        const newTextMap = {
          1: "largeTitle",
          2: "title",
          3: "subtitle",
          4: "text",
        }
        const size = useNewTextStyles
          ? // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            newTextMap[node.level] || "subtitle"
          : // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            map[node.level] || "4"
        return useNewTextStyles ? (
          <Text mb="1" variant={size} key={state.key}>
            {output(node.content, state)}
          </Text>
        ) : (
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
        <ClassTheme>
          {({ color, space }) => (
            <View
              style={{
                borderLeftColor: color("black10"),
                borderLeftWidth: 2,
                paddingLeft: space(1),
              }}
            >
              {output(node.content, state)}
            </View>
          )}
        </ClassTheme>
      ),
    },
    hr: {
      react: () => <Separator mb={2} />,
    },
    ...ruleOverrides,
  })
}

export function renderMarkdown(
  markdown: string,
  rules: any = defaultRules({})
): React.ReactElement {
  const parser = SimpleMarkdown.parserFor(rules)
  const writer = SimpleMarkdown.outputFor<any, any>(rules, "react")

  const ast = parser(markdown, { inline: false })

  return writer(ast)
}
